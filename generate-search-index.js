const fs = require('fs');
const path = require('path');
const { Octokit } = require('@octokit/rest'); // 使用 @octokit/rest 获取 issue body
const FlexSearch = require('flexsearch');

const token = process.env.GITHUB_TOKEN; // 从环境变量获取 GITHUB_TOKEN
const repoFullName = process.env.GITHUB_REPOSITORY; // 'owner/repo'
const [owner, repo] = repoFullName.split('/');

// Gmeek 生成的 postList 文件路径 (相对于仓库根目录)
const postListPath = path.join(process.cwd(), 'docs', 'postList.json');
// 索引文件输出路径 (确保在 docs 目录下)
const indexOutputPath = path.join(process.cwd(), 'docs', 'search-index.json');
// 输出目录
const outputDir = path.dirname(indexOutputPath);


// --- FlexSearch 配置 ---
// 使用 Document 索引，这样可以存储原始 ID (issue number)
// 启用基本的中文支持 (tokenize: "forward")
const index = new FlexSearch.Document({
    document: {
        id: 'id', // issue number 作为唯一 ID
        index: ['title', 'content'] // 索引 title 和 content (body) 字段
    },
    tokenize: "forward", // "forward" 提供基本的 CJK 支持
    cache: 100, // 缓存搜索结果
    context: { // 允许搜索词中的上下文信息 (提高相关性)
        resolution: 9,
        depth: 2,
        bidirectional: true
    }
});

async function fetchAllIssues() {
    if (!token) {
        console.error('Error: GITHUB_TOKEN is not set.');
        process.exit(1);
    }
    const octokit = new Octokit({ auth: token });
    const issues = [];
    let page = 1;
    try {
        // Gmeek 可能只处理了部分 issue，我们最好基于 postList.json 来确定哪些 issue 需要索引
        // 首先读取 postList.json 获取需要索引的 issue numbers
        if (!fs.existsSync(postListPath)) {
            console.error(`Error: ${postListPath} not found. Make sure Gmeek.py ran successfully.`);
            process.exit(1);
        }
        const postListContent = fs.readFileSync(postListPath, 'utf-8');
        const postListData = JSON.parse(postListContent);
        const issueNumbersToIndex = Object.keys(postListData).filter(key => key !== 'labelColorDict');

        console.log(`Found ${issueNumbersToIndex.length} posts in ${postListPath} to index.`);
        if (issueNumbersToIndex.length === 0) {
            console.log("No posts found in postList.json. Skipping issue fetch.");
            return []; // 如果 postList 为空，则无需获取 issue
        }

        // 获取仓库的所有 issue (包括 open 和 closed，因为 Gmeek 可能两者都用)
        const iterator = octokit.paginate.iterator(octokit.rest.issues.listForRepo, {
            owner: owner,
            repo: repo,
            state: 'all', // 获取 open 和 closed
            per_page: 100,
        });

        console.log("Fetching all issues from repository...");
        const allIssues = [];
        for await (const { data: issuesPage } of iterator) {
            allIssues.push(...issuesPage);
        }
        console.log(`Fetched ${allIssues.length} total issues.`);

        // 过滤出 postList.json 中存在的 issue
        console.log("Issue numbers from postList.json:", issueNumbersToIndex);
        console.log("First 10 issue numbers (stringified) from GitHub API:", allIssues.slice(0, 10).map(issue => String(issue.number)));

        const issuesToProcess = allIssues.filter(issue => {
            const apiIssueNumberStr = String(issue.number);
            const shouldInclude = issueNumbersToIndex.includes(apiIssueNumberStr);
            // if (!shouldInclude && issueNumbersToIndex.length < 20) { // Log mismatch only for smaller lists to avoid spam
            //     console.log(`Mismatch check: API issue #${apiIssueNumberStr} (type: ${typeof apiIssueNumberStr}) vs postList keys (example type: ${typeof issueNumbersToIndex[0]})`);
            // }
            return shouldInclude;
        });
        console.log(`Processing ${issuesToProcess.length} issues relevant to the blog.`);

        return issuesToProcess;

    } catch (error) {
        console.error('Error fetching issues:', error);
        process.exit(1);
    }
}

async function buildIndex() {
    const issues = await fetchAllIssues();

    // 确保输出目录存在
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
        console.log(`Created output directory: ${outputDir}`);
    }


    if (!issues || issues.length === 0) {
        console.log("No issues found to index.");
        // 仍然创建一个空的索引文件，避免前端加载失败
        const emptyIndexData = {};
         index.export((key, data) => {
            emptyIndexData[key] = data !== undefined ? data : null; // 导出时确保值存在，用 null 代替 undefined
        });
        fs.writeFileSync(indexOutputPath, JSON.stringify(emptyIndexData));
        console.log('Empty search index file created at:', indexOutputPath);
        return;
    }

    console.log(`Adding ${issues.length} documents to the index...`);
    issues.forEach(issue => {
        // 确保 issue body 存在, 即使为空字符串也要索引标题
        index.add({
            id: issue.number,
            title: issue.title || "", // 确保 title 存在
            content: issue.body || "" // 使用空字符串代替 null/undefined
        });
        if (!issue.body) {
             console.warn(`Issue #${issue.number} has empty body, indexing title only.`);
        }
    });

    console.log("Exporting index...");
    const exportedIndexData = {};
    // FlexSearch 导出是分片的，需要这样收集
    index.export((key, data) => {
         // 检查 data 是否为 undefined，如果是，存储 null 可能更安全以保证 JSON 格式
        exportedIndexData[key] = data !== undefined ? data : null;
        // console.log(`Exported index part: ${key}, Data type: ${typeof data}, Data preview: ${JSON.stringify(data)?.substring(0, 50)}...`);
    });


    fs.writeFileSync(indexOutputPath, JSON.stringify(exportedIndexData));
    console.log('Search index successfully generated at:', indexOutputPath);
}

buildIndex().catch(error => {
    console.error("Error building search index:", error);
    process.exit(1);
}); 