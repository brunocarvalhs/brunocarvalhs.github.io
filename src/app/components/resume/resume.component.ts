import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

interface Colleges {
  date: String;
  course: String;
  university: String;
  describe: String;
}

interface Work {
  date: String;
  office: String;
  company: String;
  description: String;
}

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [
    NgFor
  ],
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.scss',
})
export class ResumeComponent {

  colleges: Colleges[] = [
    {
      date: '2016 - 2021',
      course: 'Engenharia da computação',
      university: 'Esamc',
      describe: ''
    },
  ]

  works: Work[] = [
    {
      date: '2021 - Momento',
      office: 'Engenheiro de Software',
      company: 'Itaú Unibanco',
      description: '',
    },
  ];
}
