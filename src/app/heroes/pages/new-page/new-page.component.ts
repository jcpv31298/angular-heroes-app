import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { filter, pipe, switchMap, tap } from 'rxjs';

import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styleUrl: './new-page.component.css'
})
export class NewPageComponent implements OnInit {

  public heroForm = new FormGroup(
    {
      id: new FormControl<string>(''),
      superhero: new FormControl<string>('', { nonNullable: true }),
      publisher: new FormControl<Publisher>(Publisher.DCComics),
      alter_ego: new FormControl<string>(''),
      first_appearance: new FormControl(<string>''),
      characters: new FormControl<string>(''),
      alt_img: new FormControl<string>(''),
    }
  );

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' }
  ];

  constructor(
    private heroService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) return;

    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.heroService.getHeroById(id))
      ).subscribe(hero => {
        if (!hero) return this.router.navigateByUrl('/');

        this.heroForm.reset(hero);
        return;
      });
  }

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  onSubmit(): void {
    if (!this.heroForm.valid) return;

    if (this.currentHero.id) {
      this.heroService.updateHero(this.currentHero)
        .subscribe(hero => {
          this.showSnackbar(`Hero ${this.currentHero.superhero} updated successfully!!!`)
        });

      return;
    }

    this.heroService.addHero(this.currentHero)
      .subscribe(hero => {
        this.router.navigateByUrl(`/heroes/edit/${hero.id}`)
        this.showSnackbar(`Hero ${this.currentHero.superhero} created successfully!!!`)
      });
  }

  onDeleteHero(): void {
    if (!this.currentHero.id) throw Error('Hero id is required');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value
    });

    dialogRef.afterClosed()
      .pipe(
        filter((result: boolean) => result),
        switchMap(() => this.heroService.deleteHeroById(this.currentHero.id)),
        filter((wasDeleted: boolean) => wasDeleted)
      )
      .subscribe(() => this.router.navigateByUrl('/heroes'));

    // dialogRef.afterClosed().subscribe(result => {
    //   if (!result) return;

    //   this.heroService.deleteHeroById(this.currentHero.id)
    //     .subscribe(wasDeleted => {
    //       if (wasDeleted) this.router.navigateByUrl('/heroes')
    //     });
    // });
  }

  showSnackbar(message: string): void {
    this.snackbar.open(message, 'Done', {
      duration: 5000
    });
  }

}
