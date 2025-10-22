export class PaginationDto {
  readonly page: number;
  readonly limit: number;

  constructor(page: number, limit: number) {
    this.page = page;
    this.limit = limit;
  }
}