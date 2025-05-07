import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const koerapas_api_key = process.env.kOREAPAS_API_KEY as string;
const koreapas_login_url = process.env.KOREAPAS_LOGIN_URL as string;
const koreapas_verify_url = process.env.KOREAPAS_VERIFY_URL as string;

export const koreapasLogin = async (
  koreapasId: string,
  koreapasPassword: string,
) => {
  try {
    const response = await axios.post(
      koreapas_login_url,
      {
        user_id: koreapasId,
        password: koreapasPassword,
        api_key: koerapas_api_key,
      },
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );

    return response.data;
  } catch (error) {
    console.error('Error logging in to Koreapas:', error);
    throw error;
  }
};

export const koreapasVerify = async (koreapasUUID: string) => {
  try {
    const response = await axios.post(
      koreapas_verify_url,
      {
        uuid: koreapasUUID,
        api_key: koerapas_api_key,
      },
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );

    return response.data;
  } catch (error) {
    console.error('Error verifying Koreapas access token:', error);
    throw error;
  }
};
