import bcrypt from "bcryptjs";

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10); // 10 is the salt rounds
};


export const comparePassword = async (password, hashed) => {
  return await bcrypt.compare(password, hashed);
};
