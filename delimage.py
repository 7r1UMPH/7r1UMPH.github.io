import os
import glob

def find_unused_images(image_dir, post_dir):
    """
    查找并删除在博文中未使用的图片。

    Args:
        image_dir (str): 图片存放的目录。
        post_dir (str): 博文 HTML 文件存放的目录。
    """
    image_files = []
    # 支持常见的图片格式，您可以根据需要添加更多格式
    supported_extensions = ["*.png", "*.jpg", "*.jpeg", "*.gif", "*.webp", "*.ico", "*.svg"]
    for ext in supported_extensions:
        image_files.extend(glob.glob(os.path.join(image_dir, ext)))
    
    if not image_files:
        print(f"在目录 '{image_dir}' 中没有找到图片文件。")
        return

    post_html_files = glob.glob(os.path.join(post_dir, "*.html"))

    if not post_html_files:
        print(f"在目录 '{post_dir}' 中没有找到 HTML 文件。")
        # 如果没有博文，则认为所有图片都未使用（或者根据您的需求调整此逻辑）
        # for image_path in image_files:
        #     try:
        #         os.remove(image_path)
        #         print(f"已删除（无博文）: {image_path}")
        #     except OSError as e:
        #         print(f"删除文件时出错 {image_path}: {e}")
        return

    all_post_contents = ""
    for post_file in post_html_files:
        try:
            with open(post_file, 'r', encoding='utf-8', errors='ignore') as f:
                all_post_contents += f.read()
        except Exception as e:
            print(f"读取文件失败 {post_file}: {e}")
            continue
    
    deleted_count = 0
    for image_path in image_files:
        image_filename = os.path.basename(image_path)
        if image_filename not in all_post_contents:
            try:
                os.remove(image_path)
                print(f"已删除: {image_path}")
                deleted_count += 1
            except OSError as e:
                print(f"删除文件时出错 {image_path}: {e}")
        else:
            print(f"已使用: {image_filename}")

    print(f"\\n总共删除了 {deleted_count} 张未使用的图片。")

if __name__ == "__main__":
    # 获取脚本所在的当前目录
    # 我们假设脚本放在项目根目录下
    project_root = os.path.dirname(os.path.abspath(__file__)) 
    
    image_directory = os.path.join(project_root, "static", "image")
    posts_directory = os.path.join(project_root, "docs", "post")

    print(f"图片目录: {image_directory}")
    print(f"博文目录: {posts_directory}\\n")

    # 运行前提示用户确认
    confirm = input("此脚本将扫描并删除上述图片目录中未在博文目录引用的图片。\\n"
                    "强烈建议在运行前备份您的图片目录。\\n"
                    "您确定要继续吗？ (yes/no): ")

    if confirm.lower() == 'yes':
        find_unused_images(image_directory, posts_directory)
    else:
        print("操作已取消。") 