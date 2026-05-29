import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  imports: [],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar {
  placeholder = input('Search...');
  value = signal('');
  onSearch = output<string>();

  onInput(val: string) {
    this.value.set(val);
    this.onSearch.emit(val);
  }

  clear() {
    this.value.set('');
    this.onSearch.emit('');
  }
}
