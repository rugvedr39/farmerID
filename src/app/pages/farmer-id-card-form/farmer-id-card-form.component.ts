import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { FarmerService } from '../../services/farmer.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-farmer-id-card-form',
  templateUrl: './farmer-id-card-form.component.html',
  styleUrls: ['./farmer-id-card-form.component.css']
})
export class FarmerIdCardFormComponent implements OnInit {
  form: FormGroup;
  photoPreview: string | ArrayBuffer | null = null;
  languages = ['Marathi', 'English', 'Hindi'];
  genders = ['Male', 'Female', 'Other'];
  labels: any = {};
  userBalance: number = 0;
  // Card image URLs for display
  frontCardUrl: string | null = null;
  backCardUrl: string | null = null;
  isLoading: boolean = false; // Spinner state
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private farmerService: FarmerService,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      language: ['Marathi', Validators.required],
      photo: [null, Validators.required],
      nameEnglish: ['', Validators.required],
      farmerId:['',[Validators.required,Validators.pattern(/^\d{11}$/)]],
      nameMarathi: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      aadhar: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
      addressMarathi: ['', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      landDetails: this.fb.array([this.createLandDetailRow()])
    });
    
    // Initialize labels
    this.setLabels('Marathi');
  }

  get landDetails(): FormArray {
    return this.form.get('landDetails') as FormArray;
  }

  createLandDetailRow(): FormGroup {
    return this.fb.group({
      district: [''],
      subDist: [''],
      village: [''],
      sno: [''],
      area: ['']
    });
  }

  labelTranslations = {
    Marathi: {
      uploadPhoto: 'फोटो अपलोड करा',
      clickToUpload: 'फोटो अपलोड करा',
      nameEnglish: 'Name (English)',
      nameLocal: 'नाव',
      mobile: 'मोबाइल नं',
      aadhar: 'आधार नं',
      dob: 'जन्मतारीख',
      farmerId: 'शेतकरी आयडी',
      gender: 'लिंग',
      selectGender: 'लिंग निवडा',
      address: 'पत्ता',
      landDetails: 'जमिनीची माहिती',
      generate: 'कार्ड तयार करा व डाउनलोड करा'
    },
    English: {
      uploadPhoto: 'Upload Photo',
      clickToUpload: 'Click to upload',
      nameEnglish: 'Name (English)',
      nameLocal: 'Name (Local)',
      mobile: 'Mobile Number',
      aadhar: 'Aadhar Number',
      dob: 'Date of Birth',
      farmerId: 'Farmer ID',
      gender: 'Gender',
      selectGender: 'Select Gender',
      address: 'Address',
      landDetails: 'Land Details',
      generate: 'Generate & Download Card'
    },
    Hindi: {
      uploadPhoto: 'फोटो अपलोड करें',
      clickToUpload: 'फोटो अपलोड करें',
      nameEnglish: 'Name (English)',
      nameLocal: 'नाम',
      mobile: 'मोबाइल नंबर',
      aadhar: 'आधार नंबर',
      dob: 'जन्म तिथि',
      farmerId: 'किसान आईडी',
      gender: 'लिंग',
      selectGender: 'लिंग चुनें',
      address: 'पता',
      landDetails: 'भूमि विवरण',
      generate: 'कार्ड जनरेट करें और डाउनलोड करें'
    }
  };

  ngOnInit() {
    // Ensure form array is properly initialized
    if (this.landDetails.length === 0) {
      this.landDetails.push(this.createLandDetailRow());
    }
    // Check if user is logged in
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      console.log('No user data found in localStorage, trying to fetch from server...');
      // Try to fetch user data from server if token exists
      if (this.authService.isLoggedIn()) {
        this.authService.fetchAndStoreCurrentUser().subscribe({
          next: (response) => {
            if (response.user) {
              this.authService.setCurrentUser(response.user);
              console.log('User data fetched and stored:', response.user);
            }
          },
          error: (error) => {
            console.error('Error fetching user data:', error);
          }
        });
      }
    } else {
      console.log('Current user:', currentUser);
      // Fetch user balance
      this.fetchUserBalance();
    }
  }

  addLandRow() {
    this.landDetails.push(this.createLandDetailRow());
  }

  onLanguageChange() {
    const lang = this.form.value.language;
    this.setLabels(lang);
  }
  
  setLabels(lang: string) {
    this.labels = this.labelTranslations[lang as keyof typeof this.labelTranslations];
  }

  removeLandRow() {
    if (this.landDetails.length > 1) {
      this.landDetails.removeAt(this.landDetails.length - 1);
    }
  }

  fetchUserBalance() {
    this.authService.getWalletInfo().subscribe({
      next: (response) => {
        this.userBalance = response.coins;
      },
      error: (error) => {
        console.error('Error fetching user balance:', error);
      }
    });
  }

  showFormData(formData: any) {
    // Create container for form data display
    const container = document.createElement('div');
    container.className = 'mt-3 p-3 border rounded bg-light';
    container.innerHTML = `
      <h6 class="mb-3 text-success">✅ Farmer ID Form Submitted Successfully!</h6>
      <div class="row">
        <div class="col-md-6">
          <h6 class="text-primary">Personal Information</h6>
          <p><strong>Farmer ID:</strong> ${formData.farmerId}</p>
          <p><strong>Name (English):</strong> ${formData.nameEnglish}</p>
          <p><strong>Name (Marathi):</strong> ${formData.nameMarathi}</p>
          <p><strong>Mobile:</strong> ${formData.mobile}</p>
          <p><strong>Aadhar:</strong> ${formData.aadhar}</p>
          <p><strong>Date of Birth:</strong> ${formData.dob}</p>
          <p><strong>Gender:</strong> ${formData.gender}</p>
          <p><strong>Address:</strong> ${formData.addressMarathi}</p>
        </div>
        <div class="col-md-6">
          <h6 class="text-primary">Land Details</h6>
          ${formData.landDetails.map((land: any, index: number) => `
            <div class="mb-2 p-2 border-start border-primary">
              <strong>Land ${index + 1}:</strong><br>
              District: ${land.district}<br>
              Sub District: ${land.subDist}<br>
              Village: ${land.village}<br>
              Survey No: ${land.sno}<br>
              Area: ${land.area}
            </div>
          `).join('')}
        </div>
      </div>
      <div class="mt-3">
        <p class="text-muted"><small>Your form has been saved successfully. You can view this information anytime from your dashboard.</small></p>
      </div>
    `;
    
    // Add to page
    const formElement = document.querySelector('.card');
    if (formElement) {
      formElement.appendChild(container);
    }
  }

  onPhotoChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Check file size (10MB limit)
      const maxSize = 5 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        alert('File is too large. Please select an image smaller than 10MB. The image will be automatically compressed to 200KB or less.');
        event.target.value = '';
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        event.target.value = '';
        return;
      }
      
      this.form.patchValue({ photo: file });
      const reader = new FileReader();
      reader.onload = e => this.photoPreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  // Helper to wrap text in canvas
  wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  }

  // Generate the front side card image (user details)
  async generateFrontCard(formData: any) {    
    const templateUrl = 'assets/farmer_card_front.jpg';
    const img = new Image();
    img.src = templateUrl;
  
    // Wait for background to load
    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
    });
  
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
  
    // --- Photo ---
    if (formData.photoPreview) {
      const userImg = new Image();
      userImg.src = formData.photoPreview;
      await new Promise<void>((resolve) => {
        userImg.onload = () => resolve();
      });
      // Draw photo (adjust x/y/size as needed)
      ctx.drawImage(userImg, 100, 500, 1000, 1000);
      // Optionally add border
      ctx.lineWidth = 10;
      ctx.strokeStyle = '#1b5e20';
      ctx.strokeRect(100, 500, 1000, 1000);
    }
  
    // --- Text Details ---
    const xText = 1200;
    let y = 600;
    const lineSpacing = 180;
  
    ctx.textAlign = 'left';
  
    ctx.font = 'bold 130px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText(`Name: ${formData.nameEnglish}`, xText, y);
    y += lineSpacing;
  
    ctx.font = 'bold 130px Arial';
    ctx.fillText(`नाव: ${formData.nameMarathi}`, xText, y);
    y += lineSpacing;
  
    ctx.font = 'bold 130px Arial';
    ctx.fillText(`DOB: ${formData.dob}`, xText, y);
    y += lineSpacing;
  
    ctx.fillText(`Gender: ${formData.gender}`, xText, y);
    y += lineSpacing;
  
    ctx.fillText(`मोबाइल नं: ${formData.mobile}`, xText, y);
    y += lineSpacing;
  
    ctx.fillText(`आधार नं: ${formData.aadhar}`, xText, y);
    y += lineSpacing;
  
    // --- QR Code ---
    const qrUrl = `https://alldigitalservices.in/farmer/${formData.farmerId}`; // Adjust your domain
    const QRCode = await import('qrcode');
    const qrCodeDataUrl = await QRCode.default.toDataURL(qrUrl, { width: 400, margin: 1 });
  
    const qrImg = new Image();
    qrImg.src = qrCodeDataUrl;
    await new Promise<void>((resolve) => { qrImg.onload = () => resolve(); });
    ctx.drawImage(qrImg, 2750, 800, 1100, 1050);
  
    // --- Farmer ID Number at Bottom ---
    ctx.textAlign = 'center';
    ctx.font = 'bold 180px Arial';
    ctx.fillStyle = '#1b5e20';
    ctx.fillText(`${formData.farmerId}`, canvas.width / 2, canvas.height - 500);
  
    // Save Data URL
    this.frontCardUrl = canvas.toDataURL('image/jpeg');
  }

  // Generate the back side card image (land details)
  async generateBackCard(formData: any) {
    const templateUrl = 'assets/farmer_card_back.jpg';
    const img = new Image();
    img.src = templateUrl;
  
    await new Promise<void>(resolve => { img.onload = () => resolve(); });
  
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
  
    ctx.textAlign = 'center';
    ctx.font = 'bold 160px Arial';
    ctx.fillStyle = '#1b5e20';
    ctx.fillText(formData.farmerId, canvas.width / 1.7, 250);
  
    ctx.textAlign = 'left';
    ctx.font = 'bold 100px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText('पत्ता:', 200, 400);
  
    ctx.font = '100px Arial';
    this.wrapText(ctx, formData.addressMarathi, 500, 400, 2200, 120);
  
    const tableX = 200;
    const tableY = 700;
    const tableWidth = 2500;
    const rowHeight = 180;
    const colWidths = [600, 500, 500, 400, 500];
  
    // Draw table header background
    ctx.fillStyle = '#e0f2f1';
    ctx.fillRect(tableX, tableY, tableWidth, rowHeight);
  
    ctx.strokeStyle = '#1b5e20';
    ctx.lineWidth = 4;
    ctx.strokeRect(tableX, tableY, tableWidth, rowHeight);
  
    const headers = ['DISTRICT', 'SUB-DIST', 'VILLAGE', 'S.NO.', 'AREA/H'];
    ctx.font = 'bold 80px Arial';
    ctx.fillStyle = '#1b5e20';
  
    let x = tableX;
    headers.forEach((header, i) => {
      ctx.fillText(header, x + 20, tableY + 110);
      x += colWidths[i];
    });


    function splitTextIntoLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
      const words = text.split(' ');
      const lines: string[] = [];
      let currentLine = '';
    
      words.forEach(word => {
        const testLine = currentLine + word + ' ';
        const { width } = ctx.measureText(testLine);
        if (width > maxWidth && currentLine !== '') {
          lines.push(currentLine.trim());
          currentLine = word + ' ';
        } else {
          currentLine = testLine;
        }
      });
    
      lines.push(currentLine.trim());
      return lines;
    }
  
    // Draw rows
    ctx.font = '70px Arial';
    ctx.fillStyle = '#000';
    formData.landDetails.forEach((land: any, idx: number) => {
      // Prepare lines for all cells
      const values = [
        land.district,
        land.subDist,
        land.village,
        land.sno,
        land.area
      ];
    
      const cellLines: string[][] = values.map((val, i) => {
        return splitTextIntoLines(ctx, val, colWidths[i] - 40);
      });
    
      // Calculate the max number of lines for this row
      const maxLines = Math.max(...cellLines.map(lines => lines.length));
    
      // Dynamic row height (e.g., 100px per line)
      const dynamicRowHeight = maxLines * 100;
    
      const y = tableY + rowHeight + idx * rowHeight + idx * (dynamicRowHeight - rowHeight);
    
      // Row background
      ctx.fillStyle = idx % 2 === 0 ? '#ffffff' : '#f1f8e9';
      ctx.fillRect(tableX, y, tableWidth, dynamicRowHeight);
    
      // Row border
      ctx.strokeStyle = '#1b5e20';
      ctx.strokeRect(tableX, y, tableWidth, dynamicRowHeight);
    
      // Draw all text lines in each cell
      let cellX = tableX;
      cellLines.forEach((lines, i) => {
        lines.forEach((line, lineIdx) => {
          console.log('Drawing text:', line, 'at', cellX + 20, y + 80 + lineIdx * 90);
          ctx.fillStyle = '#000'; // Ensure color is set
          ctx.fillText(line || '-', cellX + 20, y + 80 + lineIdx * 90);
        });
        cellX += colWidths[i];
      });
    });
  
    // === QR Code ===
    const qrUrl = `https://alldigitalservices.in/farmer/${formData.farmerId}`;
    const QRCode = await import('qrcode');
    const qrCodeDataUrl = await QRCode.default.toDataURL(qrUrl, { width: 400, margin: 1 });
    const qrImg = new Image();
    qrImg.src = qrCodeDataUrl;
    await new Promise<void>(resolve => { qrImg.onload = () => resolve(); });
  
    ctx.drawImage(qrImg, 2750, 800, 1100, 1050);
  
    this.backCardUrl = canvas.toDataURL('image/jpeg');
  }

  

  // Call this after form submission
  async showCardImages(formData: any) {
    this.isLoading = true;
    formData.photoPreview = this.photoPreview;
    await this.generateFrontCard(formData);
    await this.generateBackCard(formData);
    this.isLoading = false;
  }

  submit() {
    this.submitted = true;
    if (this.form.valid) {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        alert('Please login to save the form');
        return;
      }
      this.isLoading = true;
      const formData = new FormData();
      formData.append('userId', currentUser.id.toString());
      formData.append('language', this.form.value.language);
      formData.append('nameEnglish', this.form.value.nameEnglish);
      formData.append('nameMarathi', this.form.value.nameMarathi);
      formData.append('mobile', this.form.value.mobile);
      formData.append('aadhar', this.form.value.aadhar);
      formData.append('farmerId', this.form.value.farmerId);
      formData.append('addressMarathi', this.form.value.addressMarathi);
      formData.append('dob', this.form.value.dob);
      formData.append('gender', this.form.value.gender);
      // Get land details from form array
      const landDetailsData = this.form.value.landDetails;
      formData.append('landDetails', JSON.stringify(landDetailsData));
      if (this.form.value.photo) {
        formData.append('photo', this.form.value.photo);
      }
      this.farmerService.saveFarmerIdForm(formData).subscribe({
        next: async (response) => {
          if (response.success) {
            const message = `Farmer ID form saved successfully!\n\nYour Farmer ID: ${response.farmerId}\nCoins deducted: ${response.coinsDeducted}\nRemaining balance: ${response.remainingBalance} coins`;
            alert(message);
            await this.showCardImages(response.formData);
            this.userBalance = response.remainingBalance;
            this.form.reset();
            this.photoPreview = null;
            this.setLabels('Marathi');
            while (this.landDetails.length !== 0) {
              this.landDetails.removeAt(0);
            }
            this.landDetails.push(this.createLandDetailRow());
            this.submitted = false;
          } else {
            alert('Error saving form: ' + response.message);
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error saving farmer ID form:', error);
          if (error.error && error.error.message) {
            alert('Error: ' + error.error.message);
          } else {
            alert('Error saving form. Please try again.');
          }
          this.isLoading = false;
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  // Add this method to download PDF
  downloadCardPdf() {
    if (!this.frontCardUrl || !this.backCardUrl) {
      alert('Please generate the card first.');
      return;
    }
    // A4 portrait in px at 72dpi: 793 x 1122
    const a4Width = 793;
    const a4Height = 1122;
    const margin = 30;
    const titleHeight = 30;
    const cardHeight = (a4Height - 4 * margin - 2 * titleHeight) / 2;
    const cardWidth = a4Width - 2 * margin;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [a4Width, a4Height] });

    // Title for front
    pdf.setFontSize(18);
    pdf.text('Front Side', a4Width / 2, margin + titleHeight / 2, { align: 'center' });
    // Add front image
    pdf.setDrawColor(27, 94, 32); // Green border
    pdf.setLineWidth(3);
    pdf.rect(margin - 2, margin + titleHeight - 2, cardWidth + 4, cardHeight + 4);
    pdf.addImage(
      this.frontCardUrl,
      'JPEG',
      margin,
      margin + titleHeight,
      cardWidth,
      cardHeight
    );
    // Title for back
    const backTitleY = margin * 2 + titleHeight + cardHeight;
    pdf.setFontSize(18);
    pdf.text('Back Side', a4Width / 2, backTitleY + titleHeight / 2, { align: 'center' });
    // Add back image
    pdf.setDrawColor(27, 94, 32); // Green border
    pdf.setLineWidth(3);
    pdf.rect(margin - 2, backTitleY + titleHeight - 2, cardWidth + 4, cardHeight + 4);
    pdf.addImage(
      this.backCardUrl,
      'JPEG',
      margin,
      backTitleY + titleHeight,
      cardWidth,
      cardHeight
    );
    pdf.save('Farmer_ID_Card.pdf');
  }


  

} 


