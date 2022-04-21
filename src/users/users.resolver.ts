import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { CreateUserInput } from './graphql/inputs/create-user.input';
import { UserType } from './graphql/types/user.type';
import { UsersService } from './users.service';

@Resolver(() => UserType)
export class UsersResolver {
  constructor(private readonly _userService: UsersService) {}

  @Query(() => UserType)
  async user(
    @Args('id', { type: () => String }) id: string,
  ): Promise<UserType> {
    return await this._userService.user(id);
  }

  @Query(() => UserType)
  async users(): Promise<UserType[]> {
    return await this._userService.users();
  }

  @Mutation(() => UserType, { name: 'createUser' })
  async createUser(
    @Args('input', new ValidationPipe()) input: CreateUserInput,
  ): Promise<UserType> {
    return await this._userService.createUser(input);
  }

  @Mutation(() => UserType, { name: 'deleteUser' })
  async deleteUser(@Args('id') id: string): Promise<UserType> {
    return await this._userService.deleteUser(id);
  }

  @Mutation(() => UserType, { name: 'recoverUser' })
  async recoverUser(@Args('id') id: string): Promise<UserType> {
    return await this._userService.recoverUser(id);
  }
}
