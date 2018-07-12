import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';
import { User } from '../shared/interfaces';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MaterialService } from '../shared/classes/material.service';


@Component({
	selector: 'app-login-page',
	templateUrl: './login-page.component.html',
	styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {

	
	form: FormGroup;
	aSub: Subscription


	constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) { 

	}

	ngOnInit() {
		this.form = new FormGroup({
			email: new FormControl(null, [Validators.required, Validators.email]),
			password: new FormControl(null, [Validators.required, Validators.minLength(6)])
		})
		this.route.queryParams.subscribe((params: Params) => {
			if (params['registered']) {
				MaterialService.toast('Now you can sign in.');
			} else if (params['accessDenied']) {
				MaterialService.toast('You must be authorized first.');
			} else if (params['sessionFailed']) {
				MaterialService.toast('Please sign in again.');
			}

		})
	}

	ngOnDestroy(): void {
		if (this.aSub)
			this.aSub.unsubscribe();
	}

  	onSubmit() {
		this.form.disable();
		const user: User = {
			email: this.form.value.email,
			password: this.form.value.password
		}
		this.aSub = this.auth.login(user).subscribe(
			() => {
				this.router.navigate(['/overview'])
			},
			(error) => {
				MaterialService.toast(error.error.message);
				console.warn(error);
				this.form.enable();

			}
		)
	  }
	  
	  

}
