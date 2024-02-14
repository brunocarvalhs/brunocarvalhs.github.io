import { userInfo } from "os";

interface UserInfo {
  fullName: string;
  profession: string | null;
  birthDate: string | null;
  address: string | null;
  email: string | null;
  projectCompleted: number | null;
}

export class UserInfoModel implements UserInfo {
  fullName: string;
  profession: string | null;
  birthDate: string | null;
  address: string | null;
  email: string | null;
  projectCompleted: number | null;

  constructor(data: UserInfo) {
    this.fullName = data.fullName;
    this.profession = data.profession;
    this.birthDate = data.birthDate;
    this.address = data.address;
    this.email = data.email;
    this.projectCompleted = data.projectCompleted;
  }
}
