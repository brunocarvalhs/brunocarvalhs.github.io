import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerlineComponent } from './timerline.component';

describe('TimerlineComponent', () => {
  let component: TimerlineComponent;
  let fixture: ComponentFixture<TimerlineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimerlineComponent]
    });
    fixture = TestBed.createComponent(TimerlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
