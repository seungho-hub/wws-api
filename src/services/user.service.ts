import prismaClient from '../database/clients/prisma';
import { wwsError } from '../utils/wwsError';
import httpStatusCode from 'http-status-codes';
import pick from '../utils/pick';
import type { PublicUserInfo } from '../@types/user';

export async function getUser(userId: number) {
  const user = await prismaClient.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new wwsError(httpStatusCode.NOT_FOUND, '사용자를 찾을 수 없습니다.');
  }

  const publicUserInfo = getPublicUserInfo(user);

  return publicUserInfo;
}

export const getPublicUserInfo = (user: Record<string, any>): PublicUserInfo =>
  pick(user, ['id', 'username', 'pfp', 'email']);
