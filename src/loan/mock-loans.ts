import { PaginatedData } from '../app/core/page/PaginatedData';
import { Loan } from './model/Loan';

export const LOAN_DATA: PaginatedData<Loan> = { 
    content: [
        {
            id: 1,
            client: {id: 1,name: 'John Doe'},
            game: {id: 1,title: 'The Legend of Zelda: Breath of the Wild',age: 12, category: {id: 2, name: 'Cat2'}, author: {id: 2, name: "Author2", nationality: 'Nat2'}},
            startDate: new Date('2023-01-01'),
            endDate: new Date('2023-01-15'),
        },
        {
            id: 2,
            client: {id: 2, name: 'Jane Smith'},
            game: {id: 2, title: 'Super Mario Odyssey', age: 10, category: {id: 1, name: 'Cat1'}, author: {id: 1, name: "Author1", nationality: 'Nat1'}},
            startDate: new Date('2023-02-01'),
            endDate: new Date('2023-02-15'),
        },
        {
            id: 3,
            client: {id: 3, name: 'Alice Johnson'},
            game: {id: 3, title: 'Animal Crossing: New Horizons', age: 3, category: {id: 3, name: 'Cat3'}, author: {id: 3, name: "Author3", nationality: 'Nat3'}},
            startDate: new Date('2023-03-01'),
            endDate: new Date('2023-03-15'),
        },
        {
            id: 4,
            client: {id: 4, name: 'Bob Brown'},
            game: {id: 4, title: 'Mario Kart 8 Deluxe', age: 3, category: {id: 4, name: 'Cat4'}, author: {id: 4, name: "Author4", nationality: 'Nat4'}},
            startDate: new Date('2023-04-01'),
            endDate: new Date('2023-04-15'),
        },
    ], pageable: {
        pageSize: 5,
        pageNumber: 0,
        sort: [{ property: 'id', direction: 'ASC'}],
    },
    totalElements: 4,
};