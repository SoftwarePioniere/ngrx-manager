import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';

import {SyncDialogComponent} from './sync-dialog.component';

describe('SyncDialogComponent', () => {
  let component: SyncDialogComponent;
  let fixture: ComponentFixture<SyncDialogComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SyncDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SyncDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
