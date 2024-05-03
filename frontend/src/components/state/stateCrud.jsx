import React, { Component } from 'react';
import axios from 'axios';
import Main from '../template/Main';
import Alert from '../template/Alert';

const headerProps = {
    icon: 'flag',
    title: 'Estados',
    subtitle: 'Cadastro de estados: Incluir, Listar, Alterar e Excluir'
};

const baseURL = 'http://localhost:3001/states'; // URL da API para estados
const initialState = {
    state: { id: 0, name: '' },
    list: [],
    error: ''
};

export default class StateCrud extends Component {
    state = { ...initialState };

    componentDidMount() {
        this.getAllStates();
    }

    getAllStates() {
        axios.get(baseURL)
            .then(resp => this.setState({ list: resp.data }))
            .catch(error => console.error('Erro ao buscar estados:', error));
    }

    clear() {
        this.setState({ state: initialState.state });
    }

    save() {
        const state = this.state.state;
        if (!state.name.trim()) {
            this.setState({ error: 'O nome do estado é obrigatório.' });
            return;
        }

        const method = state.id ? 'put' : 'post';
        const url = state.id ? `${baseURL}/${state.id}` : baseURL;
        
        axios[method](url, state)
            .then(() => {
                this.getAllStates();
                this.setState({ state: initialState.state, error: '' });
            })
            .catch(error => console.error('Erro ao salvar estado:', error));
    }

    updateField(event) {
        const state = { ...this.state.state };
        state[event.target.name] = event.target.value;
        this.setState({ state });
    }

    load(state) {
        this.setState({ state });
    }

    remove(state) {
        axios.delete(`${baseURL}/${state.id}`)
            .then(() => {
                this.getAllStates();
            })
            .catch(error => console.error('Erro ao excluir estado:', error));
    }

    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Nome do Estado</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={this.state.state.name}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o nome do estado..."
                            />
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
                        <th>Nome do Estado</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>{this.renderRows()}</tbody>
            </table>
        );
    }

    renderRows() {
        return this.state.list.map(state => {
            return (
                <tr key={state.id}>
                    <td>{state.id}</td>
                    <td>{state.name}</td>
                    <td>
                        <button
                            className="btn btn-warning"
                            onClick={() => this.load(state)}
                        >
                            Editar
                        </button>
                        <button
                            className="btn btn-danger ml-2"
                            onClick={() => this.remove(state)}
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
