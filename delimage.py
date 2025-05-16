import os
import glob


def find_unused_images_and_report(image_dir, post_dir):
    """
    查找在博文 HTML 文件中未被引用的图片文件，并生成报告。

    参数:
        image_dir (str): 存放图片的目录路径。
        post_dir (str): 存放博客 HTML 文件的目录路径。

    返回:
        list: 未使用的图片文件完整路径列表。
    """
    # 支持的图片扩展名列表
    supported_extensions = ["*.png", "*.jpg", "*.jpeg", "*.gif", "*.webp", "*.ico", "*.svg"]
    image_files = []
    
    # 收集所有支持的图片文件
    for ext in supported_extensions:
        image_files.extend(glob.glob(os.path.join(image_dir, ext)))

    if not image_files:
        print(f"在目录 '{image_dir}' 中没有找到图片文件。")
        return []

    # 获取所有博文 HTML 文件
    post_html_files = glob.glob(os.path.join(post_dir, "*.html"))

    if not post_html_files:
        print(f"在目录 '{post_dir}' 中没有找到 HTML 文件。")
        # 如果没有博文，则所有图片都视为未使用
        print("由于未找到博文，以下所有图片将被视为未使用：")
        for i, image_path in enumerate(image_files):
            print(f"  {i+1}. {os.path.basename(image_path)} ({image_path})")
        return image_files

    # 合并所有博文内容以便查找引用关系
    all_post_contents = ""
    for post_file in post_html_files:
        try:
            with open(post_file, 'r', encoding='utf-8', errors='ignore') as f:
                all_post_contents += f.read()
        except Exception as e:
            print(f"读取文件失败 {post_file}: {e}")
            continue

    # 检查每张图片是否被引用
    unused_images = []
    print("\n--- 扫描报告 ---")
    for image_path in image_files:
        image_filename = os.path.basename(image_path)
        if image_filename not in all_post_contents:
            unused_images.append(image_path)
            print(f"  [未使用] {image_filename} ({image_path})")
        else:
            print(f"  [已使用] {image_filename}")

    if not unused_images:
        print("\n没有找到未使用的图片。")

    return unused_images


if __name__ == "__main__":
    # 确定项目根目录（脚本所在目录）
    project_root = os.path.dirname(os.path.abspath(__file__))
    
    # 默认图片与博文目录结构
    image_directory = os.path.join(project_root, "static", "image")
    posts_directory = os.path.join(project_root, "docs", "post")

    print(f"图片目录: {image_directory}")
    print(f"博文目录: {posts_directory}\n")

    # 用户确认运行脚本
    initial_confirm = input(
        "此脚本将扫描图片目录并报告未在博文目录中引用的图片。\n"
        "之后您可以选择要保留的图片，其余将被删除。\n"
        "强烈建议在运行前备份您的图片目录。\n"
        "您确定要继续扫描吗？ (yes/no): "
    )
    if initial_confirm.lower() != 'yes':
        print("操作已取消。")
        exit()

    # 执行扫描并获取未使用的图片列表
    deletable_images = find_unused_images_and_report(image_directory, posts_directory)

    if not deletable_images:
        print("所有图片均在使用中或未找到图片。")
        exit()

    # 显示即将删除的图片列表
    print("\n--- 预删除报告 ---")
    print("以下图片似乎未被使用，并计划被删除：")
    for i, img_path in enumerate(deletable_images):
        print(f"  {i+1}. {os.path.basename(img_path)} ({img_path})")

    # 提示用户输入希望保留的图片编号
    print("\n请输入您不想删除的图片的编号 (用逗号或空格分隔, 例如: 1, 3 或 2 4)。")
    print("如果全部删除，请直接按 Enter 键。")
    user_input_to_keep = input("要保留的图片编号: ")

    images_to_keep_indices = set()
    if user_input_to_keep.strip():
        try:
            # 替换逗号为空格后分割为多个字符串
            str_indices = user_input_to_keep.replace(",", " ").split()
            for idx_str in str_indices:
                if idx_str.strip():  # 排除空字符串
                    idx = int(idx_str.strip()) - 1  # 转换为 0-based index
                    if 0 <= idx < len(deletable_images):
                        images_to_keep_indices.add(idx)
                    else:
                        print(f"警告: 编号 {idx + 1} 无效，已忽略。")
        except ValueError:
            print("错误：输入的编号格式不正确。将不会保留任何特定图片，请检查是否要删除所有列出的图片。")

    # 分离最终需要删除和保留的图片路径
    final_images_to_delete = []
    images_actually_kept_paths = []

    for i, img_path in enumerate(deletable_images):
        if i in images_to_keep_indices:
            images_actually_kept_paths.append(img_path)
        else:
            final_images_to_delete.append(img_path)

    # 输出保留的图片
    if images_actually_kept_paths:
        print("\n--- 以下图片将被保留 ---")
        for img_path in images_actually_kept_paths:
            print(f"  [保留] {os.path.basename(img_path)}")

    if not final_images_to_delete:
        print("\n没有图片需要删除。")
        exit()

    # 确认删除操作
    confirm_deletion = input(f"\n即将删除 {len(final_images_to_delete)} 张图片。您确定吗? (yes/no): ")
    deleted_count = 0
    if confirm_deletion.lower() == 'yes':
        print("\n--- 开始删除 ---")
        for img_path in final_images_to_delete:
            try:
                os.remove(img_path)
                print(f"  已删除: {img_path}")
                deleted_count += 1
            except OSError as e:
                print(f"  删除文件时出错 {img_path}: {e}")
        print(f"\n总共删除了 {deleted_count} 张图片。")
    else:
        print("删除操作已取消。")