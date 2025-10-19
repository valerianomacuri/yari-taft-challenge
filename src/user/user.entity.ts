export class User {
  public id: string;
  public name: string;
  public email: string;
  public createdAt: Date;

  constructor(id: string, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.createdAt = new Date();
  }
}
