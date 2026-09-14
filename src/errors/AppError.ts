export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  } // this: o novo "erro" criado terá o mesmo protótipo do AppError, garantindo que instanceof funcione corretamente
}
// instanceof: verifica se um obj foi criado a partir de uma determinada classe ou construtor.
