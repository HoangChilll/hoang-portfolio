---
title: Git và Github
date: 2026-05-20
tags: [Git, Github]
description: Git và github, quy trình khái niệm
---
# Git & GitHub: Khái Niệm và Các Lệnh Thông Dụng

---

## 1. Git là gì?

**Git** là một **hệ thống quản lý phiên bản phân tán** (Distributed Version Control System - DVCS), được Linus Torvalds tạo ra năm 2005.

Git giúp bạn:
- Lưu lại **lịch sử thay đổi** của toàn bộ dự án theo thời gian.
- Quay lại bất kỳ **phiên bản cũ** nào khi cần.
- Làm việc **song song** trên nhiều tính năng mà không xung đột nhau (branch).
- **Cộng tác nhóm** — nhiều người cùng làm việc trên một codebase.

> Git hoạt động hoàn toàn **offline** trên máy cục bộ. Bạn không cần internet để commit, tạo branch, hay xem lịch sử.

---

## 2. GitHub là gì?

**GitHub** là một **dịch vụ lưu trữ repository Git trên cloud**. Nó không phải là Git — GitHub chỉ là nơi để bạn đẩy (push) code lên và chia sẻ với người khác.
```
| Tiêu chí     | Git                              | GitHub                              |

| Bản chất     | Phần mềm / công cụ CLI           | Dịch vụ web (website)               |
| Cài đặt      | Cài trên máy tính                | Truy cập qua trình duyệt / API      |
| Hoạt động    | Offline được                     | Cần internet                        |
| Lưu trữ      | Trên máy cục bộ                  | Trên server của GitHub              |
| Thay thế     | Không thay thế được              | Có thể dùng GitLab, Bitbucket thay  |
```
---

## 3. Các Khái Niệm Cốt Lõi

### 3.1 Repository (Repo)

Kho chứa toàn bộ mã nguồn và lịch sử thay đổi của dự án.

- **Local repo**: repo trên máy tính của bạn.
- **Remote repo**: repo trên server (GitHub, GitLab, ...).

### 3.2 Commit

Một **snapshot (ảnh chụp)** trạng thái toàn bộ project tại một thời điểm. Mỗi commit có:
- Một **mã hash SHA-1** duy nhất (ví dụ: `a3f2c1d`).
- Thông điệp mô tả (`commit message`).
- Tác giả, thời gian.
- Con trỏ đến commit trước đó (parent).

```
commit a3f2c1d
Author: Nguyen Van A <a@email.com>
Date:   Mon May 19 2025

    feat: thêm chức năng đăng nhập
```

### 3.3 Branch (Nhánh)

Một **luồng phát triển độc lập**. Mặc định có nhánh `main` (hoặc `master`). Tạo branch mới để phát triển tính năng, sửa bug mà không ảnh hưởng code chính.

```
main ──●──●──●──────────────●  (merge)
              \            /
feature ────────●──●──●──●
```

### 3.4 Staging Area (Index)

Vùng trung gian giữa thư mục làm việc và commit. Bạn phải `add` file vào staging area trước khi `commit`.

```
Thư mục làm việc  →  Staging Area  →  Repository (commit)
  (chỉnh sửa)          (git add)          (git commit)
```

### 3.5 HEAD

Con trỏ đặc biệt, luôn trỏ vào **commit hiện tại** bạn đang đứng. Thường trỏ vào đầu branch đang làm việc.

### 3.6 Remote & Origin

- **Remote**: tên gọi của repo từ xa (server).
- **Origin**: tên mặc định Git đặt cho remote khi bạn clone một repo.

```bash
 git remote -v
 # origin  https://github.com/user/repo.git (fetch)
 # origin  https://github.com/user/repo.git (push)
```

### 3.7 Clone, Fork, Pull Request

| Khái niệm       | Ý nghĩa                                                                 |
|-----------------|-------------------------------------------------------------------------|
| **Clone**       | Tải toàn bộ repo từ remote về máy cục bộ                                |
| **Fork**        | Tạo bản sao repo của người khác vào tài khoản GitHub của bạn            |
| **Pull Request**| Yêu cầu merge code của bạn vào repo gốc (thường dùng khi cộng tác)      |

---

## 4. Luồng Làm Việc Cơ Bản

```
1. git init / git clone          ← khởi tạo hoặc tải repo về
2. (chỉnh sửa file)
3. git status                    ← xem trạng thái thay đổi
4. git add <file>                ← đưa vào staging
5. git commit -m "message"       ← lưu snapshot
6. git push                      ← đẩy lên remote (GitHub)
```

---

## 5. Các Lệnh Git Thông Dụng

---

### 5.1 Thiết lập ban đầu

```bash
 # Cấu hình tên và email (chỉ làm 1 lần)
git config --global user.name "Nguyen Van A"
git config --global user.email "a@email.com"

 # Xem toàn bộ cấu hình
git config --list

 # Đặt editor mặc định là VS Code
git config --global core.editor "code --wait"
```

---

### 5.2 Khởi tạo & Clone

```bash
 # Khởi tạo repo mới trong thư mục hiện tại
git init

 # Khởi tạo repo với tên thư mục cụ thể
git init ten-du-an

 # Clone repo từ GitHub về máy
git clone https://github.com/user/repo.git

 # Clone và đặt tên thư mục khác
git clone https://github.com/user/repo.git ten-thu-muc
```

---

### 5.3 Theo Dõi Trạng Thái

```bash
 # Xem trạng thái các file (modified, staged, untracked)
git status

 # Xem trạng thái ngắn gọn
git status -s

 # Xem thay đổi chi tiết (chưa staged)
git diff

 # Xem thay đổi đã staged (sẽ vào commit tiếp theo)
git diff --staged

 # Xem lịch sử commit
git log

 # Lịch sử gọn, mỗi commit 1 dòng
git log --oneline

 # Lịch sử dạng đồ thị branch
git log --oneline --graph --all
```

---

### 5.4 Staging & Commit

```bash
 # Thêm 1 file vào staging
git add ten-file.java

 # Thêm nhiều file
git add file1.java file2.java

 # Thêm tất cả file thay đổi trong thư mục hiện tại
git add .

 # Thêm tất cả file thay đổi trong toàn bộ repo
git add -A

 # Commit với message
git commit -m "feat: thêm màn hình đăng nhập"

 # Add tất cả + commit trong 1 lệnh (chỉ với file đã tracked)
git commit -am "fix: sửa lỗi null pointer"

 # Sửa message của commit vừa rồi (chưa push)
git commit --amend -m "message mới"
```

---

### 5.5 Branch

```bash
 # Xem tất cả branch (local)
git branch

 # Xem cả branch remote
git branch -a

 # Tạo branch mới
git branch ten-branch

 # Chuyển sang branch khác
git checkout ten-branch

 # Tạo branch mới và chuyển sang luôn (cách thường dùng)
git checkout -b ten-branch

 # Cách mới hơn (Git 2.23+)
git switch -c ten-branch

 # Đổi tên branch hiện tại
git branch -m ten-moi

 # Xóa branch (đã merge)
git branch -d ten-branch

 # Xóa branch bắt buộc (chưa merge)
git branch -D ten-branch

 # Xóa branch trên remote
git push origin --delete ten-branch
```

---

### 5.6 Merge & Rebase

```bash
 # Merge branch khác vào branch hiện tại
git checkout main
git merge feature/dang-nhap

 # Merge không tạo merge commit (fast-forward)
git merge --ff-only feature/dang-nhap

 # Merge luôn tạo merge commit dù có thể fast-forward
git merge --no-ff feature/dang-nhap

 # Rebase: đặt lại gốc của branch lên đầu main
git checkout feature/dang-nhap
git rebase main

 # Hủy rebase đang dở
git rebase --abort
```

> **Merge vs Rebase:**
> - `merge` giữ nguyên lịch sử, tạo commit merge → an toàn, dễ hiểu.
> - `rebase` viết lại lịch sử, tạo lịch sử tuyến tính → gọn hơn nhưng **không dùng với branch đã push lên remote chia sẻ.**

---

### 5.7 Remote — Kết Nối với GitHub

```bash
 # Xem danh sách remote
git remote -v

 # Thêm remote
git remote add origin https://github.com/user/repo.git

 # Đổi URL remote
git remote set-url origin https://github.com/user/repo-moi.git

 # Xóa remote
git remote remove origin

 # Tải thay đổi từ remote về (không merge)
git fetch origin

 # Tải + merge vào branch hiện tại
git pull origin main

 # Đẩy code lên remote
git push origin main

 # Đẩy lần đầu và thiết lập upstream (lần sau chỉ cần git push)
git push -u origin main

 # Đẩy tất cả branch lên remote
git push --all origin
```

---

### 5.8 Stash — Cất Tạm Thay Đổi

Dùng khi đang làm dở mà cần chuyển branch gấp, chưa muốn commit.

```bash
 # Cất tạm tất cả thay đổi chưa commit
git stash

 # Cất tạm với tên mô tả
git stash save "đang làm tính năng tìm kiếm"

 # Xem danh sách stash
git stash list
 # stash@{0}: đang làm tính năng tìm kiếm
 # stash@{1}: WIP on main: a3f2c1d fix bug

 # Lấy lại stash gần nhất (và xóa khỏi danh sách)
git stash pop

 # Lấy lại stash cụ thể (giữ lại trong danh sách)
git stash apply stash@{1}

 # Xóa stash cụ thể
git stash drop stash@{0}

 # Xóa tất cả stash
git stash clear
```

---

### 5.9 Undo — Hoàn Tác

```bash
 # Bỏ staged của file (giữ nguyên thay đổi trong file)
git restore --staged ten-file.java

 # Hủy thay đổi của file về trạng thái commit cuối (MẤT thay đổi!)
git restore ten-file.java

 # Quay HEAD về commit trước, giữ thay đổi ở staging
git reset --soft HEAD~1

 # Quay HEAD về commit trước, giữ thay đổi ở working dir (không staged)
git reset --mixed HEAD~1   # (mặc định nếu không ghi gì)

 # Quay HEAD về commit trước, XÓA LUÔN thay đổi (nguy hiểm!)
git reset --hard HEAD~1

 # Hoàn tác 1 commit bằng cách tạo commit mới đảo ngược (an toàn cho remote)
git revert a3f2c1d

 # Xem file ở 1 commit cụ thể mà không chuyển branch
git checkout a3f2c1d -- ten-file.java
```

> **Khi nào dùng cái nào:**
> - `restore` → hủy thay đổi chưa commit.
> - `reset` → xóa/dời commit (chỉ dùng với commit chưa push).
> - `revert` → an toàn khi đã push lên remote, không viết lại lịch sử.

---

### 5.10 Tag — Đánh Dấu Phiên Bản

```bash
 # Tạo tag nhẹ (lightweight)
git tag v1.0.0

 # Tạo tag có chú thích (annotated) — nên dùng
git tag -a v1.0.0 -m "Release phiên bản 1.0.0"

 # Xem danh sách tag
git tag

 # Xem thông tin chi tiết tag
git show v1.0.0

 # Đẩy tag lên remote
git push origin v1.0.0

 # Đẩy tất cả tag
git push origin --tags
```

---

### 5.11 Các Lệnh Tiện Ích Khác

```bash
 # Xem ai đã sửa từng dòng của file
git blame ten-file.java

 # Tìm kiếm commit đã gây ra bug (binary search)
git bisect start
git bisect bad          # commit hiện tại bị lỗi
git bisect good v1.0.0  # commit cũ còn tốt
 # Git tự checkout giữa chừng, bạn test rồi báo good/bad
git bisect reset        # kết thúc

 # Xem nội dung file ở commit cụ thể
git show a3f2c1d:src/Main.java

 # Xem danh sách file thay đổi trong 1 commit
git show --stat a3f2c1d

 # Xóa file khỏi tracking (nhưng giữ trên disk)
git rm --cached ten-file.java

 # Dọn dẹp file untracked (xem trước)
git clean -n

 # Dọn dẹp file untracked (thực sự xóa)
git clean -f
```

---

## 6. File .gitignore

Khai báo những file/thư mục Git sẽ **bỏ qua, không theo dõi**.

```gitignore
 # Thư mục build
/target/
/build/
/out/

 # Dependency
/node_modules/
/.gradle/

 # File cấu hình IDE
/.idea/
/.vscode/
*.iml

 # File môi trường (chứa password, API key — KHÔNG ĐƯỢC commit!)
.env
.env.local
application-local.properties

 # File hệ thống
.DS_Store
Thumbs.db

 # File log
*.log
logs/
```

> Nếu đã lỡ commit file rồi mới thêm vào `.gitignore`, cần chạy:
> ```bash
> git rm --cached ten-file  # bỏ khỏi tracking
> git commit -m "chore: bỏ file khỏi tracking"
> ```

---

## 7. Quy Ước Commit Message

Chuẩn **Conventional Commits** được dùng phổ biến:

```
<type>: <mô tả ngắn>

[optional body]

[optional footer]
```

| Type       | Ý nghĩa                                  |
|------------|------------------------------------------|
| `feat`     | Thêm tính năng mới                       |
| `fix`      | Sửa bug                                  |
| `docs`     | Cập nhật tài liệu                        |
| `style`    | Format code, không đổi logic            |
| `refactor` | Tái cấu trúc code, không thêm/sửa tính năng |
| `test`     | Thêm hoặc sửa test                       |
| `chore`    | Công việc bảo trì, build, config         |

```bash
git commit -m "feat: thêm chức năng tìm kiếm sản phẩm"
git commit -m "fix: sửa lỗi NullPointerException khi đăng nhập"
git commit -m "docs: cập nhật hướng dẫn cài đặt trong README"
git commit -m "refactor: tách class UserService thành 2 class riêng"
```

---

## 8. Tổng Hợp Lệnh Theo Tình Huống
```
| Tình huống                              | Lệnh                                          |
|-----------------------------------------|-----------------------------------------------|
| Bắt đầu dự án mới                       | `git init` → `git remote add origin <url>`    |
| Tải repo về                             | `git clone <url>`                             |
| Xem có gì thay đổi                      | `git status` / `git diff`                     |
| Lưu thay đổi                            | `git add .` → `git commit -m "..."`           |
| Đẩy lên GitHub                          | `git push origin main`                        |
| Lấy code mới nhất từ nhóm               | `git pull origin main`                        |
| Làm tính năng mới                       | `git checkout -b feature/ten-tinh-nang`       |
| Xong tính năng, merge vào main          | `git checkout main` → `git merge feature/...` |
| Cất dở đang làm để chuyển branch        | `git stash` → (làm việc khác) → `git stash pop` |
| Hủy thay đổi chưa commit                | `git restore ten-file`                        |
| Xóa commit vừa rồi (chưa push)          | `git reset --soft HEAD~1`                     |
| Hoàn tác commit đã push                 | `git revert <hash>`                           |
| Đánh dấu phiên bản release              | `git tag -a v1.0.0 -m "..."` → `git push --tags` |
```
# Quy trình làm việc git chuẩn 
![git](/images/git.png)
  - Nhánh `develop` để phát triển `tính năng `
  - Từ nhánh `develop` sẽ tạo ra các nhánh `feature`
  - Làm xong sẽ đẩy lên nhánh `develop`
  - Từ nhánh develop sẽ đẩy lên nhánh release
  - Nếu nhánh release ổn rồi sẽ đẩy lên nhánh master, đẩy xong thì sẽ xóa ở nhánh release đi 
  - Đôi lúc master gặp lỗi thì sẽ push thẳng về nhánh hotfixes sau đó đẩy về develop để sửa lỗi, xong thì sẽ xóa hotfixes
## Cách commit chuẩn

 - **git commit -m'#1-fafnakfalf'** được giao issue số bao nhiêu thì phải commit # issue đó
 - Sau đó người review code sẽ vô issue comment rồi trưởng nhóm thấy oke rồi mới merge
## git rebase và git merge

Theo mình thấy thì nên nói rõ ra chứ thực tế nhánh dev và nhánh master đều ở chế độ protect chỉ có quản lý mới đẩy lên được thôi, viết thế này nhiều bạn lại tưởng push lên 2 nhánh đó thoải mái lại toang! Ngoài ra khái niệm rebase hiểu đơn giản là biến commit của nhánh khác thành commit nhánh hiện tại (rebase nghĩa là chuyển cơ sở), bản chất là nó biến commit của nhánh cần merge thành commit của nhánh được merge (nghĩa là commit rebase sẽ được bê nguyên nội dung và snapshot sang nhánh mới nên trên tree log sẽ là 1 đường thẳng và các commit này đều bị thay đổi SHA dù giống nội dung và snap shot). Còn git merge là thực hiện merge bình thường tuy nhiên commit vẫn giữ nguyên SHA không thay đổi và cây git sẽ hiển thị không còn là đường thẳng nữa, ngoài ra git merge còn tạo ra 1 commit gọi là commit merge.
