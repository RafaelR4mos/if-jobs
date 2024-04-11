import bcrypt from 'bcrypt';

export async function hashPassword(password: string) {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log(hashedPassword);
    return hashedPassword;
  } catch (error) {
    throw error;
  }
}
