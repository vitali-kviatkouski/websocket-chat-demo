import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ChatService } from "../services/chat.service";

@Injectable()
export class AuthorizedGuard implements CanActivate {

    constructor(public srv: ChatService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.srv.authorizationLog.pipe(map(authorized => {
            if (!authorized) {
                this.router.navigate(['/login']);
            }
            return authorized;
        }));
    }
    
}