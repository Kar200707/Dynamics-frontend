import { CanActivateChildFn, Router } from "@angular/router";
import { inject } from "@angular/core";

export const mainPageGuard: CanActivateChildFn = () => {
  const token: string | null = localStorage.getItem('token');
  const router:Router = inject(Router);

  if (token) {
    return true
  }

  router.navigate(['/login'])

  return false;
};
