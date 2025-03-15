// Cài thêm thư viện @types/bcrypt ở môi trường dev để được gợi ý code vì nó được viết bằng TS(cung cấp kiểu dữ liệu cho TS)
import * as bcrypt from 'bcrypt'; // package này viết bằng JS thuần

const saltRounds = 10;

export const hashPassword = async (plainPassword: string) => {
  return await bcrypt.hash(plainPassword, saltRounds);
}

export const comparePassword = async (plainPassword: string, hashedPassword: string) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
}
