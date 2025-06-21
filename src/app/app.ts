import { LitElement, html, nothing, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators/custom-element.js';
import { state } from 'lit/decorators/state.js';
import { PokemonService } from '../common/pokemon.service.js';
import type { Pokemon } from '../common/types.js';
import styles from './app.css?inline';

@customElement('app-root')
export class App extends LitElement {
  @state() pokemon: Pokemon[] = [];

  @state() filteredPokemon: Pokemon[] = [];

  @state() activePokemon: Pokemon | null = null;

  static styles = [unsafeCSS(styles)];

  render() {
    return html`
<header>
  <h1>Pokédex</h1>
  <button popovertarget="about">about</button>
</header>

<main>
  <input type="search" placeholder="Search" aria-label="search" @input=${this.#search} />
  <ol>
    ${this.filteredPokemon.map(pokemon => html`
    <li>
      <button popovertarget="details" @click=${() => this.activePokemon = pokemon}>
        <i class="sprite ${'sprite-' + pokemon.id}"></i>
        <div>
          <h3>${pokemon.name}</h3>
          <span>#${pokemon.id}</span>
        </div>
      </button>
    </li>`)}
  </ol>
</main>

<dialog id="details" popover>
  <button popovertarget="details" popovertogglaction="close" aria-label="close">&times;</button>
  ${this.activePokemon !== null ? html`
  <div class="pokemon-details">
    <i class="sprite ${'sprite-' + this.activePokemon.id}"></i>
    <div class="pokemon-content">
      <h2>${this.activePokemon.name} #${this.activePokemon.id}</h2>
      <div class="pokemon-types">
        ${this.activePokemon.types.map(type => html`<span class="type ${type}">${type}</span>`)}
      </div>
      <p>
        <strong>Height:</strong> ${this.activePokemon.height}m
        <strong>Weight:</strong> ${this.activePokemon.weight}kg
      </p>
      <p>${this.activePokemon.description}</p>
    </div>
  </div>` : nothing}
</dialog>

<dialog id="about" popover>
  <button popovertarget="about" popovertogglaction="close" aria-label="close">&times;</button>
  <h3>Lit Pokédex</h3>
  <ul>
    <li>Open source on <a href="https://github.com/coryrylan/lit-pokedex">Github</a></li>
    <li>Built with <a href="https://lit.dev">Lit</a></li>
    <li>Built by <a href="https://coryrylan.com/">Cory Rylan</a></li>
    <li>Inspiration from <a href="https://www.pokedex.org/">https://www.pokedex.org/</a>.</li>
    <li>Data and sprites from the <a href="https://pokeapi.co/">https://pokeapi.co/</a> and <a href="http://pokemondb.net/">http://pokemondb.net/</a>. </li>
    <li>All content is ©Nintendo, Game Freak, and The Pokémon Company.</li>
  </ul>
</dialog>
    `
  }

  async connectedCallback() {
    super.connectedCallback();
    this.pokemon = await PokemonService.getPokemon();
    this.filteredPokemon = this.pokemon;
  }

  #search(event: InputEvent) {
    const term = (event.target as HTMLInputElement).value;
    this.filteredPokemon = this.pokemon.filter(p => term ? p.name.toLowerCase().includes(term.toLowerCase()) : this.pokemon);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-root': App
  }
}
