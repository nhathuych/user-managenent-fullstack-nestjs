// Cài thêm thư viện @types/bcrypt ở môi trường dev để được gợi ý code vì nó được viết bằng TS(cung cấp kiểu dữ liệu cho TS)
import { hash } from 'bcrypt'; // package này viết bằng JS thuần

const saltRounds = 10;

export const hashPassword = async (plainPassword: string) => {
  try {
    return await hash(plainPassword, saltRounds);
  } catch (error) {
    console.log(error);
  }
}
