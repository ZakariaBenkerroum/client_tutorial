import { Pageable } from '../app/core/page/Pageable';
import { Injectable, inject } from '@angular/core';
import { LOAN_DATA } from './mock-loans';
import { Observable, of } from 'rxjs';
import { Loan } from './model/Loan';
import { LoanSearchDto } from './LoanSearchDto';
import { PaginatedData } from '../app/core/page/PaginatedData';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
    })
export class LoanService {

    private readonly baseUrl = 'http://localhost:8080/loan';

    private http = inject(HttpClient);

    constructor(){}

    getLoans(searchDto: LoanSearchDto): Observable<PaginatedData<Loan>> {
        return this.http.post<PaginatedData<Loan>>(this.baseUrl, searchDto);
    }


    saveLoan(loan: Loan): Observable<Loan> {
        const url = loan.id !== null ? `${this.baseUrl}/${loan.id}` : this.baseUrl;
        return this.http.put<Loan>(url, loan);
    }

    deleteLoan(loanId: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${loanId}`);
    }

}
