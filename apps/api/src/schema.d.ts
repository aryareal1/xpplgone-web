import type { AuthModel } from './modules/auth/model';
import type { CheckinsModel } from './modules/checkins/model';
import type { JournalModel } from './modules/journal/model';
import type { StorageModel } from './modules/storage/model';
import type { UserModel } from './modules/user/model';

export type {
  AuthModel,
  CheckinsModel,
  JournalModel,
  StorageModel,
  UserModel,
};

export type User = UserModel['User'];
export type Student = UserModel['Student'];