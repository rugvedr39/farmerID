import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-farmer-detail',
  templateUrl: './farmer-detail.component.html',
  styleUrls: ['./farmer-detail.component.css']
})
export class FarmerDetailComponent implements OnInit {
  farmer: any = null;
  loading = true;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const farmerId = this.route.snapshot.paramMap.get('farmerId');
    if (farmerId) {
      this.loading = true;
      this.http.get<any>(`https://api.alldigitalservices.in/api/farmer/farmer/${farmerId}`).subscribe({
        next: (res) => {
          if (res.success) {
            this.farmer = res.farmer;
            this.error = null;
          } else {
            this.error = 'Farmer not found.';
          }
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error fetching farmer details.';
          this.loading = false;
        }
      });
    } else {
      this.error = 'No Farmer ID provided.';
      this.loading = false;
    }
  }
}
