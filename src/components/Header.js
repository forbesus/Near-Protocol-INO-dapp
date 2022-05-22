import { Nav, Navbar, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export const Header = (props) => {
    const { 
        isSignedIn,
        accountId, 
        wallet,
        contractId,
        isAdmin
    } = props;

    const signIn = () => {
        wallet.requestSignIn(
            contractId,
            "INO",
            window.location.origin,
            window.location.origin
        );
    };
    
    const signOut = () => {
        wallet.signOut();
        window.location.replace(window.location.origin);
    };

    return (
        <Navbar bg='dark' variant='dark'>
            <Container>
                <Navbar.Brand href='/'>
                    DAO NATION INO
                </Navbar.Brand>
                <Navbar.Toggle aria-controls='responsive-navbar-nav' />
                <Navbar.Collapse id='responsive-navbar-nav'>
                    <Nav className='me-auto'>
                    </Nav>
                
                    <Nav>
                        {
                            isAdmin && 
                            <Link to="/new" style={{padding: '0.5rem'}}>Add New Collection</Link>
                        }
                        <Nav.Link>
                            { isSignedIn ? accountId : ""}
                        </Nav.Link>
                        <Nav.Link
                            onClick={() => isSignedIn ? signOut() : signIn()}
                        >
                            { isSignedIn ? "Logout" : "Login"}
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}