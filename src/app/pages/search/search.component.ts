import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Doctor } from '../../models/doctor';
import { DoctorService, MedecinRequest } from '../../services/doctor.service';
import { DoctorCardComponent } from '../../shared/doctor-card/doctor-card.component';
import { MapComponent } from '../../components/map/map';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, DoctorCardComponent, MapComponent],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchPageComponent implements OnInit {
  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  searchTerm: string = '';

  constructor(private doctorService: DoctorService, private router: Router) {}

  ngOnInit(): void {
    this.doctorService.getDoctors().subscribe((medecins: MedecinRequest[]) => {
      // Map MedecinRequest to Doctor
      this.doctors = medecins.map(medecin => ({
        id: medecin.id,
        nom: medecin.nom,
        prenom: medecin.prenom,
        specialite: medecin.specialite,  // garde l’objet complet
        rating: 0,
        distance: 0
      }));
      
      
      this.filteredDoctors = [...this.doctors]; // Initialize filtered list
    });
  }

  onSearchSubmit(): void {
    if (!this.searchTerm.trim()) {
      this.filteredDoctors = [...this.doctors];
    } else {
      this.filteredDoctors = this.doctors.filter(doctor =>
        doctor.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        doctor.specialite?.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.router.navigate(['/search'], {
      queryParams: { q: this.searchTerm }
    });
  }
}