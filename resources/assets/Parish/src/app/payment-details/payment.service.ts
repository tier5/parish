/** Service created for upload payment */

import {Headers, Http, RequestOptions} from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment.prod';
import { Subject } from "rxjs/Subject";

@Injectable()
export class PaymentService {
	
	/** Injecting services to be used in this component */
	constructor( private http: Http,
	             private authService: AuthService ) {
		if( this.authService.isAuthenticated() ) {
			this.refreshHeader();
		}
	}
	
	/** Initializing custom Observables */
	closePromptEvent = new Subject();
	deleteEvent = new Subject();
	refreshList = new Subject();
	showPromptEvent  = new Subject();
	
	/** Initializing the different headers to be passed with each api call */
	
	headers = new Headers( {
		'X-Requested-With': 'XMLHttpRequest'
	} );
	
	/** Refreshing the header for authenticated users */
	refreshHeader() {
		this.headers.set('Authorization', 'Bearer ' + this.authService.getToken().token);
	}
	
	/** Function to create a new payment */
	paymentCreate( body: any): Observable<any> {
		const headers = this.headers;
		headers.delete('Content-Type');
		return this.http.post( environment.API_URL + 'payment/upload-payment', body, { headers: this.headers } );
	}
	
	/** Get List of all payment  */
	listPayment( body: any ): Observable<any> {
		const user_id   = this.authService.getToken().user_id;
		const user_type = this.authService.getToken().user_type;
		return this.http.post( environment.API_URL + 'payment/' + user_id + '/' + user_type, body, { headers: this.headers } );
	}
	
	/** Function to change status of payment */
	paymentChangeStatus( body: any): Observable<any> {
		const headers = this.headers;
		headers.delete('Content-Type');
		return this.http.put( environment.API_URL + 'payment/update-payment-status' + '/' +body.id, body, { headers: this.headers } );
	}
	/** Function to delete an existing payment */
	deletePayment( payment_id: number) : Observable<any> {
		const wem_id = this.authService.getToken().user_id;
		const api_url = environment.API_URL + 'payment/delete/' + payment_id;
		return this.http.delete( api_url, { headers: this.headers } );
	}
}