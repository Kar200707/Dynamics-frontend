import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";

export const loginRegGuard: CanActivateFn = (route, state) => {
  const token: string | null = localStorage.getItem('token');
  const router:Router = inject(Router);

  if (!token) {
    return true;
  }

  router.navigate(['/home']);

  return false;
};
