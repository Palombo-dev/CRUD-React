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
    error: ''
};

export default class TradeCrud extends Component {
    state = { ...initialState };

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
            .then(resp => this.setState({ list: resp.data }))
            .catch(error => console.error('Erro ao buscar negociações:', error));
    }
    
    clear() {
        this.setState({ trade: initialState.trade });
    }

    save() {
        const trade = this.state.trade;
        const id = trade.id;
        if (id !== 0) {
            axios.put(`${baseURL}/trade/${id}`, trade) // Usando PUT e passando o ID da negociação
                .then(resp => {
                    const updatedTrade = resp.data; // Negociação atualizada
                    const updatedList = this.state.list.map(item => (item.id === id ? updatedTrade : item)); // Atualizando a lista localmente
                    this.setState({
                        list: updatedList,
                        trade: initialState.trade, // Reiniciando o estado do formulário
                        error: ''
                    });
                })
                .catch(error => console.error('Erro ao atualizar negociação:', error));
        } else {
            axios.post(`${baseURL}/trade`, trade) // Usando POST para criar uma nova negociação
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
