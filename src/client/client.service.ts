import { Client } from './client';
import { Observable, of } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { CLIENT_DATA } from './mock-clients';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ClientService {

    protected readonly http = inject(HttpClient);

    private baseUrl = 'http://localhost:8080/client';

    constructor() { }

    getClients(): Observable<Client[]> {
        return this.http.get<Client[]>(this.baseUrl);
    }

    saveClient(client: Client): Observable<Client> {
        const { id } = client;
        const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;
        return this.http.put<Client>(url, client);
    }

    deleteClient(clientId: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${clientId}`);
    }
}