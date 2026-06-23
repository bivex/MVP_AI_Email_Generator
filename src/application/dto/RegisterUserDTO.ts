export interface RegisterUserDTO {
  email: string
  password: string
  name: string
}

export interface RegisterUserResult {
  user: {
    id: string
    email: string
    name: string
    plan: string
  }
}
