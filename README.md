# Advertisement Management
 
## Các bước setup để chạy được ứng dụng:
* **Cài đặt dependencies:** Mở terminal, để đường dẫn đến file source code, và cài đặt các dependencies bằng lệnh: **npm install**.

* **Tạo database MongoDB:** Đầu tiên cài đặt các ứng dụng cần thiết cho MongoDB (nếu chưa có). Sau đó vào file generate-test-data có trong db.zip, cài đặt các dependencies cho file như bước 1, tiếp theo mở terminal ở file scripts và nhập lệnh: node generate.js. **_Database cũng sẽ được tạo nếu người dùng chạy chương trình mà không sử dụng script này._**

* **Chạy chương trình:** Ở file source, người dùng có thể nhập lệnh chạy chương trình: **nodemon.js**. Database đã có sẵn 3 tài khoản cho 3 phân hệ Sở, Quận, và Phường. (Mật khẩu của các tài khoản đều là **acc123**). Phân hệ người dùng không cần tài khoản.
    * Tài khoản Sở: **sovhtt@test.test**.
    * Tài khoản Quận 1: **quan1@test.test**.
    * Tài khoản Phường Đa Kao, Quận 1: **dakaoQ1@test.test**.

