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
        const postListJsonKeys = Object.keys(postListData).filter(key => key !== 'labelColorDict');
        console.log(`Issue numbers from postList.json: [\n  ${postListJsonKeys.join(', ')}\n]`);

        // Extract the actual issue numbers from the 'P' prefixed keys
        const postIssueNumbers = postListJsonKeys.map(key => key.startsWith('P') ? key.substring(1) : key);

        console.log('Fetching all issues from repository...');
        // Fetch all issues (posts) from the repository
        const { data: issuesPage } = await octokit.rest.issues.listForRepo({
            owner: owner,
            repo: repo,
            state: 'all', // 获取 open 和 closed
            per_page: 100,
        });
        console.log(`Fetched ${issuesPage.length} total issues.`);

        // Filter issues to include only those present in postList.json based on the extracted numbers
        const relevantIssues = issuesPage.filter(issue => postIssueNumbers.includes(issue.number.toString()));
        console.log(`First 10 issue numbers (stringified) from GitHub API: [\n  ${relevantIssues.slice(0, 10).map(issue => String(issue.number)).join(', ')}\n]`);

        console.log(`Processing ${relevantIssues.length} issues relevant to the blog.`);

        return relevantIssues;

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