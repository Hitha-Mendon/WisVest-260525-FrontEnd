import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  getLogoPath(): string {
    return `${environment.assetsPath}${environment.logoFileName}`;
  }

  getHeroPath(): string {
    return `${environment.assetsPath}${environment.heroFileName}`;
  }

  getGoalPath(): string {
    return `${environment.assetsPath}${environment.goalFileName}`;
  }

  getAgePath(): string {
    return `${environment.assetsPath}${environment.ageFileName}`;
  }

  getRiskPath(): string {
    return `${environment.assetsPath}${environment.riskFileName}`;
  }

  getTargetPath(): string {
    return `${environment.assetsPath}${environment.targetFileName}`;
  }

  getHorizonPath(): string {
    return `${environment.assetsPath}${environment.horizonFileName}`;
  }

  getWorkPath(): string {
    return `${environment.assetsPath}${environment.workFileName}`;
  }
}
