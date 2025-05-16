export class CreateUserCommand {
  constructor(
    public readonly userEmail: string,
    public readonly userPassword: string,
    public readonly userFirstName: string,
    public readonly userLastName: string,
  ) {}
}