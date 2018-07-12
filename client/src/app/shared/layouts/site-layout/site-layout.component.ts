import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-site-layout',
	templateUrl: './site-layout.component.html',
	styleUrls: ['./site-layout.component.css']
})
export class SiteLayoutComponent implements OnInit {

	links = [
		{url: '/overview', name: 'Overview'},
		{url: '/analytics', name: 'Analytics'},
		{url: '/history', name: 'History'},
		{url: '/order', name: 'Add an order'},
		{url: '/categories', name: 'Assortment'}
	]

	constructor(private auth: AuthService, private router: Router) { }

	ngOnInit() {
		
	}

	logout(event: Event) {
		event.preventDefault();
		this.auth.logout();
		this.router.navigate(['/login']);


	}

}
