import { Pageable } from '../app/core/page/Pageable';

export class LoanSearchDto {
    pageable: Pageable;
    idGame?: number;
    idClient?: number;
    // Because the backend is waiting for LocalDate Type
    date?: string;
}