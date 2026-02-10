export class CreateProjectDto {
  title: string;
  clientId: string; // to know who this project is for
  deadline?: string; // Optional ISO Date string
}
