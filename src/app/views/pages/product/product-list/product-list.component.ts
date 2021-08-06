import { Component, OnInit } from "@angular/core";
import { Product } from "../../../../shared/models/product";
// import { AuthService } from "../../../../shared/services/auth.service";
import { ProductService } from "../../../../shared/services/product.service";
import { ToastrService } from "src/app/shared/services/toastr.service";
@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
})
export class ProductListComponent implements OnInit {
  productList: Product[];
  brands: string[];
  loading = false;

  selectedBrand: "All";

  page = 1;
  constructor(
    // public authService: AuthService,
    private productService: ProductService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.getAllProducts();
    console.log(this.brands);
  }

  getAllProducts() {
    this.loading = true;
    const x = this.productService.getProducts();
    x.snapshotChanges().subscribe(
      (product) => {
        this.loading = false;
        this.productList = [];
        this.brands = ["All"];
        product.forEach((element) => {
          const y = { ...element.payload.toJSON(), $key: element.key };
          const p = y as Product;
          this.productList.push(p);
          console.log("Seller here" + p.productSeller);
          this.brands.push(p.productSeller.valueOf());
        });
        this.brands = [...new Set( this.brands)];
      },
      (err) => {
        this.toastrService.error("Error while fetching Products", err);
      }
    );
  }

  removeProduct(key: string) {
    this.productService.deleteProduct(key);
  }

  addFavourite(product: Product) {
    this.productService.addFavouriteProduct(product);
  }

  addToCart(product: Product) {
    this.productService.addToCart(product);
  }
}
