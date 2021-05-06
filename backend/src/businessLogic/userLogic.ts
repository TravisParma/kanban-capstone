import { UserData } from "../dataLayer/userData";
import { Users } from "../models/Users";
import * as uuid from 'uuid'
import { CreateUser } from "../models/CreateUser";



const userData = new UserData();

export async function getUsers(active: string): Promise<Users[]> {
    return userData.getUsers(active);
}

export async function createUser(
    CreateUser: CreateUser
    ): Promise<Users>{
    
    const itemId = uuid.v4()

    return await userData.createUser({
      id: itemId,
      createdAt: new Date().getTime().toString(),
      active: "y",
      userName: CreateUser.userName,
      wipLimit: CreateUser.wipLimit
    });
  }