import React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Layout } from 'antd';
import Splitter from '../../components/splitter';
import TeamList from './team_list';
import Members from './members';
import Environments from './environments';
import { DtoTeam } from '../../../../api/interfaces/dto_team';
import { State } from '../../state';
import { actionCreator, UpdateLeftPanelType, ResizeLeftPanelType } from '../../action';
import { DisbandTeamType, QuitTeamType, SaveTeamType, RemoveUserType, InviteMemberType, SaveEnvironmentType, DelEnvironmentType } from './action';
import './style/index.less';
import * as _ from 'lodash';
import { DtoUser } from '../../../../api/interfaces/dto_user';
import { DtoEnvironment } from '../../../../api/interfaces/dto_environment';

const { Content, Sider } = Layout;

interface TeamStateProps {

    collapsed: boolean;

    leftPanelWidth: number;

    user: DtoUser;

    teams: DtoTeam[];

    environments: _.Dictionary<DtoEnvironment[]>;
}

interface TeamDispatchProps {

    resizeLeftPanel(width: number);

    collapsedLeftPanel(collapsed: boolean);

    disbandTeam(team: DtoTeam);

    quitTeam(team: DtoTeam);

    updateTeam(team: DtoTeam);

    createTeam(team: DtoTeam);

    removeUser(teamId: string, userId: string);

    invite(teamId: string, emails: string[]);

    createEnv(env: DtoEnvironment);

    updateEnv(env: DtoEnvironment);

    delEnv(envId: string, teamId: string);
}

type TeamProps = TeamStateProps & TeamDispatchProps;

interface TeamState {

    activeTeam: string;
}

class Team extends React.Component<TeamProps, TeamState> {

    constructor(props: TeamProps) {
        super(props);
        this.state = {
            activeTeam: props.teams.length > 0 ? (props.teams[0].id || '') : ''
        };
    }

    isSelectTeamOwn = () => {
        const team = this.props.teams.find(t => t.id === this.state.activeTeam);
        return !!team && !!team.owner && team.owner.id === this.props.user.id;
    }

    getSelectTeamMembers = () => {
        const team = this.props.teams.find(t => t.id === this.state.activeTeam);
        if (!team || !team.members) {
            return [];
        }
        return _.sortBy(team.members.map(t => ({ id: t.id, name: t.name, email: t.email, isOwner: t.id === team.owner.id })), m => m.name);
    }

    getSelectTeamEnvironments = () => {
        const env = this.props.environments[this.state.activeTeam];
        return _.sortBy(env, e => e.name);
    }

    public render() {
        const { user, collapsed, collapsedLeftPanel, teams, leftPanelWidth, disbandTeam, quitTeam, updateTeam, createTeam, removeUser, invite, createEnv, updateEnv, delEnv } = this.props;

        return (
            <Layout className="main-panel">
                <Sider
                    className="collection-sider"
                    style={{ minWidth: collapsed ? 0 : leftPanelWidth }}
                    collapsible={true}
                    collapsedWidth="0.1"
                    collapsed={collapsed}
                    onCollapse={collapsedLeftPanel}>
                    <TeamList
                        activeTeam={this.state.activeTeam}
                        selectTeam={(id) => this.setState({ ...this.state, activeTeam: id })}
                        user={user}
                        teams={teams}
                        disbandTeam={disbandTeam}
                        quitTeam={quitTeam}
                        updateTeam={updateTeam}
                        createTeam={createTeam}
                    />
                </Sider>
                <Splitter resizeCollectionPanel={this.props.resizeLeftPanel} />
                <Content className="team-right-panel">
                    <Members
                        activeTeam={this.state.activeTeam}
                        isOwner={this.isSelectTeamOwn()}
                        members={this.getSelectTeamMembers()}
                        removeUser={removeUser}
                        invite={invite}
                    />
                    <div style={{ height: 12 }} />
                    <Environments
                        environments={this.getSelectTeamEnvironments()}
                        createEnv={createEnv}
                        updateEnv={updateEnv}
                        activeTeam={this.state.activeTeam}
                        delEnv={envId => delEnv(envId, this.state.activeTeam)}
                    />
                </Content>
            </Layout>
        );
    }
}

const mapStateToProps = (state: State): TeamStateProps => {
    const { leftPanelWidth, collapsed } = state.uiState;
    const teams = state.teamState.teams;
    const user = state.userState.userInfo as DtoUser;

    return {
        leftPanelWidth: leftPanelWidth,
        collapsed: collapsed,
        user: user,
        teams: _.chain(teams).values<DtoTeam>().sortBy('name').sortBy(t => t.owner.id !== user.id).value(),
        environments: state.environmentState.environments
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): TeamDispatchProps => {
    return {
        resizeLeftPanel: (width) => dispatch(actionCreator(ResizeLeftPanelType, width)),
        collapsedLeftPanel: (collapsed) => dispatch(actionCreator(UpdateLeftPanelType, collapsed)),
        disbandTeam: (team) => { dispatch(actionCreator(DisbandTeamType, team)); },
        quitTeam: (team) => { dispatch(actionCreator(QuitTeamType, team)); },
        updateTeam: (team) => dispatch(actionCreator(SaveTeamType, { isNew: false, team })),
        createTeam: (team) => dispatch(actionCreator(SaveTeamType, { isNew: true, team })),
        removeUser: (teamId, userId) => { dispatch(actionCreator(RemoveUserType, { teamId, userId })); },
        invite: (teamId, emails) => { dispatch(actionCreator(InviteMemberType, { teamId, emails })); },
        createEnv: (env) => { dispatch(actionCreator(SaveEnvironmentType, { isNew: true, env })); },
        updateEnv: (env) => { dispatch(actionCreator(SaveEnvironmentType, { isNew: false, env })); },
        delEnv: (envId, teamId) => { dispatch(actionCreator(DelEnvironmentType, { envId, teamId })); }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Team);