import React, { Component } from 'react';
import axios from 'axios';
import Main from '../template/Main';
import Alert from '../template/Alert';

const headerProps = {
    icon: 'handshake-o',
    title: 'Negociações',
    subtitle: 'Cadastro de negociações vinculadas a estados'
};

const baseURL = 'http://localhost:3001'; // URL base da API
const initialState = {
    trade: { id: 0, name: '', EstadoId: 0 },
    list: [],
    states: [],
    error: '',
    filterStateId: 0, // Adição para armazenar o ID do estado selecionado para filtragem
};

export default class TradeCrud extends Component {
    state = { ...initialState, originalList: [] }; // Adicionando originalList ao estado inicial

    componentDidMount() {
        this.getAllStates();
    }
    
    getAllStates() {
        axios.get(`${baseURL}/states`)
            .then(resp => {
                console.log('Lista de estados:', resp.data);
                this.setState({ states: resp.data }, () => {
                    // Após obter todos os estados, chama getAllTrades
                    this.getAllTrades();
                });
            })
            .catch(error => console.error('Erro ao buscar estados:', error));
    }
    
    getAllTrades() {
        axios.get(`${baseURL}/trade`)
            .then(resp => {
                // Armazena a lista original e a lista exibida
                this.setState({ list: resp.data, originalList: resp.data });
            })
            .catch(error => console.error('Erro ao buscar negociações:', error));
    }
    
    clear() {
        this.setState({ trade: initialState.trade });
    }

    save() {
        const trade = this.state.trade;
        axios.post(`${baseURL}/trade`, trade)
            .then(resp => {
                const newTrade = resp.data; // Nova negociação adicionada
                this.setState(prevState => ({
                    list: [...prevState.list, newTrade], // Adiciona a nova negociação à lista atual
                    trade: initialState.trade, // Reinicia o estado do formulário
                    error: ''
                }));
            })
            .catch(error => console.error('Erro ao salvar negociação:', error));
    }
    
    filter() {
        const { filterStateId, originalList } = this.state;
        console.log('filterStateId:', filterStateId); // Adicionar este log para depuração
        let filteredList;
        if (filterStateId === 0) {
            // Se o filtro for "Todos", exibe a lista original
            filteredList = originalList;
        } else {
            // Filtra as negociações pelo EstadoId selecionado
            filteredList = originalList.filter(trade => {
                const stateId = parseInt(trade.EstadoId); // Converter EstadoId para número
                return stateId === filterStateId;
            });
        }
        console.log('Lista filtrada:', filteredList); // Adicionar este log para depuração
        this.setState({ list: filteredList });
    }
    
    resetFilter() {
        this.setState({ list: this.state.originalList, filterStateId: 0 });
    }
    
    updateField(event) {
        const trade = { ...this.state.trade };
        trade[event.target.name] = event.target.value;
        this.setState({ trade });
    }

    load(trade) {
        this.setState({ trade });
    }

    remove(trade) {
        axios.delete(`${baseURL}/trade/${trade.id}`)
            .then(() => {
                this.getAllTrades();
            })
            .catch(error => console.error('Erro ao excluir negociação:', error));
    }

    getTradeStateName(trade) {
        console.log('Negociação:', trade.name, 'Estados:', this.state.states, 'EstadoId:', trade.EstadoId); // Adicione este log para debug
        const stateId = parseInt(trade.EstadoId); // Converter EstadoId para número
        const state = this.state.states.find(state => state.id === stateId);
        console.log('Estado:', state); // Adicione este log para debug
        return state ? state.name : '';
    }

    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Nome da Negociação</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={this.state.trade.name}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o nome da negociação..."
                            />
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>ID do Estado</label>
                            <select
                                className="form-control"
                                name="EstadoId"
                                value={this.state.trade.EstadoId}
                                onChange={e => this.updateField(e)}
                            >
                                <option value="">Selecione o estado...</option>
                                {this.state.states.map(state => (
                                    <option key={state.id} value={state.id}>{state.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="col-12 col-md-2">
                        <div className="form-group">
                            <label>Filtrar por Estado</label>
                            <select
                                className="form-control"
                                value={this.state.filterStateId}
                                onChange={(e) => this.setState({ filterStateId: parseInt(e.target.value) })}
                            >
                                <option value={0}>Todos</option>
                                {this.state.states.map(state => (
                                    <option key={state.id} value={state.id}>{state.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button
                            className="btn btn-primary"
                            onClick={() => this.save()}
                        >
                            Salvar
                        </button>
                        <button
                            className="btn btn-secondary ml-2"
                            onClick={() => this.clear()}
                        >
                            Cancelar
                        </button>
                        <div className="ml-2">
                            <button
                                className="btn btn-info"
                                onClick={() => this.filter()}
                            >
                                Filtrar
                            </button>
                            <button
                                className="btn btn-info ml-2"
                                onClick={() => this.resetFilter()}
                            >
                                Limpar Filtro
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderTable() {
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome da Negociação</th>
                        <th>Estado</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>{this.renderRows()}</tbody>
            </table>
        );
    }
    
    renderRows() {
        return this.state.list.map(trade => {
            return (
                <tr key={trade.id}>
                    <td>{trade.id}</td>
                    <td>{trade.name}</td>
                    <td>{this.getTradeStateName(trade)}</td>
                    <td>
                        <button
                            className="btn btn-warning"
                            onClick={() => this.load(trade)}
                        >
                            Editar
                        </button>
                        <button
                            className="btn btn-danger ml-2"
                            onClick={() => this.remove(trade)}
                        >
                            Excluir
                        </button>
                    </td>
                </tr>
            );
        });
    }

    render() {
        return (
            <Main {...headerProps}>
                {this.state.error && <Alert message={this.state.error} />}
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        );
    }
}
