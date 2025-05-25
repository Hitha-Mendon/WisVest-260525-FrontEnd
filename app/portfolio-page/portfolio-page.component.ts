import { Component, OnInit } from '@angular/core';
import { ChartType, ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ConfigService } from '../services/config.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-portfolio-page',
  standalone: true,
  imports: [NgChartsModule, CommonModule,TranslateModule],
  templateUrl: './portfolio-page.component.html',
  styleUrls: ['./portfolio-page.component.css'],
})
export class PortfolioPageComponent implements OnInit {
  portfolioData: any;
  productData: any;
  subClasses: { name: string; percentage: number }[] = [];
  selectedAssetClass: string = '';
  selectedSubClassName: string = '';
  filteredProducts: any[] = [];
  sortColumn: string = ''; // Current column being sorted
  sortDirection: 'asc' | 'desc' = 'asc'; // Current sort direction
  investmentAmount: number = 0;
  logoPath: string;
  workPath: string;
  apiUrl: string = environment.apiBaseUrl + environment.endpoints.allocation.getCalculatedAllocations;
  apiUrl1: string = environment.apiBaseUrl + environment.endpoints.productAllocation.getCalculatedProducts;

  // Chart data for asset classes
  assetClassChartLabels: string[] = [];
  assetClassChartData: number[] = [];
  pieChartType: ChartType = 'pie';
  assetClassChartColors: string[] = ['#4E79A7', '#F28E2B', '#76B7B2', '#59A14F', '#EDC948'];
  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },    
  };

  // Chart data for sub-classes
  subCategoryLabels: string[] = [];
  subCategoryData: number[] = [];
  subCategoryColors: string[] = ['#4E79A7', '#F28E2B', '#76B7B2', '#59A14F', '#EDC948'];

  constructor(private router: Router, private http: HttpClient,private configService: ConfigService) {
    this.logoPath = this.configService.getLogoPath();
    this.workPath = this.configService.getWorkPath();
  }

  ngOnInit(): void {
    this.getallocatedProducts();
    this.getPortfolioData();
  }

  getPortfolioData(): void {
    this.http.get(this.apiUrl).subscribe({
      next: (response: any) => {
        this.portfolioData = response;
        console.log('Portfolio Data:', this.portfolioData);

        // Populate chart data
        this.assetClassChartLabels = Object.keys(this.portfolioData.assets);
        this.assetClassChartData = Object.values(this.portfolioData.assets).map((asset: any) => asset.percentage);

        // Set default selected asset class and sub-classes
        const firstAssetClass = this.assetClassChartLabels[0];
        if (firstAssetClass) {
          this.onAssetSelected(firstAssetClass);
        }
      },
    });
  }

getallocatedProducts(): void {
  this.http.get(this.apiUrl1).subscribe({
    next: (response) => {
      console.log('API Response:', response);
      this.productData = (response as any).productAllocations;
      this.investmentAmount = parseFloat(((response as any).totalInvestment).toFixed(2));
      console.log('Product Data:', this.productData);
      console.log('Investment Amount:', this.investmentAmount);

      // Display all products by default
      this.filterProducts();
    },
    error: (err) => {
      console.error('Error fetching product data:', err);
    },
  });
}
filterProducts(): void {
  if (!this.productData) {
    console.warn('Product data is not available.');
    this.filteredProducts = [];
    return;
  }

  const allProducts: any[] = [];

  // Iterate through the productData structure to extract all products
  Object.keys(this.productData).forEach((assetClassKey) => {
    const subClasses = this.productData[assetClassKey];
    Object.keys(subClasses).forEach((subClassKey) => {
      const products = subClasses[subClassKey];
      Object.keys(products).forEach((productKey) => {
        allProducts.push(products[productKey]);
      });
    });
  });

  console.log('All Products:', allProducts);

  // If no asset class or sub-class is selected, show all products
  if (!this.selectedAssetClass && !this.selectedSubClassName) {
    this.filteredProducts = allProducts;
  } else {
    // Normalize asset class names for comparison
    const normalizedSelectedAssetClass = this.selectedAssetClass.replace(/\s+/g, '').toLowerCase();

    // Filter products based on the selected asset class and sub-class
    this.filteredProducts = allProducts.filter((product) => {
      const normalizedProductAssetClass = product.asset_class.replace(/\s+/g, '').toLowerCase();
      const matchesAssetClass = normalizedProductAssetClass === normalizedSelectedAssetClass;
      const matchesSubClass = this.selectedSubClassName
        ? product.sub_asset_class.replace(/\s+/g, '').toLowerCase() === this.selectedSubClassName.replace(/\s+/g, '').toLowerCase()
        : true;

      return matchesAssetClass && matchesSubClass;
    });
  }

  console.log('Filtered Products:', this.filteredProducts);
}

  onAssetSelected(assetClass: string): void {
    const selectedAsset = this.portfolioData.assets[assetClass];
    if (selectedAsset) {
      this.selectedAssetClass = assetClass;
      this.subClasses = Object.entries(selectedAsset.subAssets).map(([name, percentage]) => ({
        name,
        percentage: percentage as number,
      }));

      // Update sub-category chart data
      this.subCategoryLabels = this.subClasses.map((sub) => sub.name);
      this.subCategoryData = this.subClasses.map((sub) => sub.percentage);

      this.selectedSubClassName = ''; // Reset sub-class selection
      this.filterProducts(); // Update filtered products
    } else {
      console.warn(`Asset class "${assetClass}" not found in portfolio data.`);
    }
  }

  onSubClassSelected(subClassName: string): void {
    this.selectedSubClassName = subClassName;
    this.filterProducts(); // Update filtered products
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  products(): void {
    this.router.navigate(['/products']);
  }

  input(): void {
    this.router.navigate(['/input']);
  }

  home(): void {
    this.router.navigate(['/landing']);
  }
 downloadExcel(): void {
 if (!this.filteredProducts || this.filteredProducts.length === 0) {
  console.warn('No data to export');
  return;
 }

 console.log('Exporting sample product:', this.filteredProducts[0]);

 const exportData = this.filteredProducts.map(p => ({
  'Product Name': p.productName || p.product_name || 'N/A',
  'Annual Return': (p.annualReturn ?? p.return ?? p.annual_return ?? 'N/A') + '%',
  'Asset Class': p.assetClass || p.asset_class || 'N/A',
  'Sub Asset Class': p.subAssetClass || p.sub_asset_class || 'N/A',
  'Risk Level': p.riskLevel || p.risk || p.risk_level || 'N/A',
  'Liquidity': p.liquidity || p.liquidity || 'N/A',
  'Investment Amount': p.investmentAmount || p.investment_amount || 'N/A',
 }));

 const worksheet = XLSX.utils.json_to_sheet(exportData);
 const workbook = XLSX.utils.book_new();
 XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

 const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
 const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
 saveAs(blob, 'Investment_Products.xlsx');
}

sortByColumn(column: string): void {
  if (this.sortColumn === column) {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    this.sortColumn = column;
    this.sortDirection = 'asc';
  }
 
  const customOrder = {
    liquidity: ['Low', 'Medium', 'High'],
    risk_level: ['Low', 'Moderate', 'High'], // key fixed here
  };
 
  this.filteredProducts.sort((a, b) => {
    const valA = a[column] ?? a[column.toLowerCase()] ?? '';
    const valB = b[column] ?? b[column.toLowerCase()] ?? '';
 
    // Handle custom sort for liquidity and risk_level
    if (column === 'liquidity' || column === 'risk_level') {
      const order = customOrder[column];
      const normalize = (val: string) =>
        String(val).trim().toLowerCase().replace(/^\w/, c => c.toUpperCase());
      
      const indexA = order.indexOf(normalize(valA));
      const indexB = order.indexOf(normalize(valB));
 
      const safeIndexA = indexA === -1 ? order.length : indexA;
      const safeIndexB = indexB === -1 ? order.length : indexB;
 
      return this.sortDirection === 'asc' ? safeIndexA - safeIndexB : safeIndexB - safeIndexA;
    }
 
    // Numeric sort
    if (typeof valA === 'number' && typeof valB === 'number') {
      return this.sortDirection === 'asc' ? valA - valB : valB - valA;
    }
 
    // String sort fallback
    return this.sortDirection === 'asc'
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });
}
}