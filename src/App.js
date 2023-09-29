import { useState } from 'react';
import { useEffect } from 'react';
import './hover.css';

import { Row, Col, Accordion, InputGroup, Button, Container, FormCheck } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

function App() {

  const [angleCheckLocked, setAngleCheckLocked] = useState(false);
  const [angleCheckCoords, setAngleCheckCoords] = useState(
    {
      x1: 0.00,
      y1: 0.00,
      x2: 0.00,
      y2: 0.00
    }
  );
  const [rotationAngle, setRotationAngle] = useState(0);
  const [selectedFile, setSelectedFile] = useState();
  const [xmlLoaded, setXmlLoaded] = useState(false);
  const [svgWidth, setSVGWidth] = useState(0);
  const [svgHeight, setSVGHeight] = useState(0);
  const [svgContent, setSVGContent] = useState(null);
  const [preview, setPreview] = useState();
  const [orchidParams, setOrchidParams] = useState(
    {
      width:          3.20,
      pillarSpace:    10.0,
      rowStartOffset: 2.00,
      robotStep:      10.00
    }
  );
  const [disableSaO, setDisableSaO] = useState(false);
  const [scaleAndOffset, setScaleAndOffset] = useState(
    {
      x1: 0.00,
      y1: 0.00,
      x2: 0.00,
      y2: 0.00,
      x3: 0.00,
      y3: 0.00
    }
  );
  const [isABchecked, setIsABChecked] = useState(false);
  const [isCchecked, setIsCChecked] = useState(false);
  const [edgePolygon, setEdgePolygon] = useState([]);
  const [polygons, setPolygons] = useState([]);


  /* ---------------------------------------------------------- */

  const handleChangeAB = () => setIsABChecked(!isABchecked);

  const handleChangeC = () => setIsCChecked(!isCchecked);

  const handleLockAngle = (e) => {
    setAngleCheckLocked(e.target.checked);
  }

  const handleCoordsChange = (property, ev) => {
    let newCoords = {
      ...angleCheckCoords, [property]: parseFloat(ev.target.value)
    };
    setAngleCheckCoords(newCoords);
    let rAngle = Math.atan2(angleCheckCoords.y2 - angleCheckCoords.y1, angleCheckCoords.x2 - angleCheckCoords.x1) * 180 / Math.PI - 90;
    setRotationAngle(rAngle);
    //
    //  Prikaz na slici
    //
  }

  const handleSelectFile = e => {
    if(!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      setXmlLoaded(false);
      return;
    }
    setSelectedFile(e.target.files[0]);
    let text = "";
    let reader = new FileReader();
    let onload = function(e) {
      text = reader.result;
      let parser = new DOMParser();
      let xmlDoc = parser.parseFromString(text, "text/xml");
      setSVGWidth(parseInt(xmlDoc.getElementsByTagName("svg")[0].getAttribute("width")));
      setSVGHeight(parseInt(xmlDoc.getElementsByTagName("svg")[0].getAttribute("height")));
      setSVGContent(xmlDoc.getElementsByTagName("path"));
      setXmlLoaded(true);
    }
    reader.onload = onload;
    reader.readAsText(e.target.files[0]);
  }

  const handleLogAngle = () => {
    console.log("Kontrole za računanje kuta: ", angleCheckCoords);
  }

  const handleChangeOrchidParams = (pr, ev) => {
    let newParams = {
      ...orchidParams, [pr]: parseFloat(ev.target.value)
    };
    setOrchidParams(newParams);
  }

  const handleLogGeneralOrchidParams = () => {
    console.log("Opći parametri voćnjaka: ", orchidParams);
  }

  const handleChangeSaO = (attr, operation) => {
    let val = scaleAndOffset[attr];
    if(operation === 'dec') {
      val--; // podesiti za potrebe slike
    }
    else {
      val++;
    }
    let newsao = {...scaleAndOffset, [attr]: val };
    setScaleAndOffset(newsao);
  }

  const handleChangeScaleAndOffset = (attrib, e) => {
    let newVals = { ...scaleAndOffset, [attrib]: e.target.value };
    setScaleAndOffset(newVals);
  }

  const handleAddNewVertex = () => {
    let newData = [...edgePolygon];
    let newVertex = {
      x: 0.00,
      y: 0.00
    };
    newData.push(newVertex);
    setEdgePolygon(newData);
  }

  const hendleChangeEdgePolygonVertex = (pr, i, ev) => {
    let allVertex = [...edgePolygon];
    let newVertex = { ...allVertex[i], [pr]: parseFloat(ev.target.value) };
    allVertex[i] = newVertex;
    setEdgePolygon(allVertex);
  }

  const handleDeleteVertex = (i) => {
    let newPolygon = [...edgePolygon];
    newPolygon.splice(i, 1);
    setEdgePolygon(newPolygon);
  }

  const handleAddNewPolygon = () => {
    let oldPolygons = [...polygons];
    let newPolygon = {
      x1: 0.00,
      y1: 0.00,
      x2: 0.00,
      y2: 0.00,
      x3: 0.00,
      y3: 0.00,
      x4: 0.00,
      y4: 0.00
    };
    oldPolygons.push(newPolygon);
    setPolygons(oldPolygons);
  }

  const handleChangePolygon = (pr, i, ev) => {
    let allPolygons = [...polygons];
    let newPolygon = { ...allPolygons[i], [pr]: parseFloat(ev.target.value) };
    allPolygons[i] = newPolygon;
    setPolygons(allPolygons);
  }

  const handleDeletePolygon = i => {
    let oldPolygons = [...polygons];
    oldPolygons.splice(i, 1);
    setPolygons(oldPolygons);
  }

  const handleCalculate = () => {
    
  }

  /* 
  
  */

  useEffect(() => {
    if(!selectedFile) {
      setPreview(undefined);
      setXmlLoaded(false);
      return;
    }
    const mobjectUrl = URL.createObjectURL(selectedFile);
    setPreview(mobjectUrl);
    return () => URL.revokeObjectURL(mobjectUrl);
  },[angleCheckCoords, selectedFile])

  return (
    <div className="App">
       <Row className='mt-1'>
          <Col lg={1}></Col>
          <Col lg={10}>
            <h1 className='text-center fw-bold shadow p-3 mb-5 bg-white rounded text-secondary'>AgriART - modul za izradu vektor-mape</h1>
          </Col>
          <Col lg={1}></Col>
        </Row>
        <Row>
          <Col lg={1}></Col>
          <Col lg={10}>
            <Accordion className='shadow p-3 mb-2 bg-white rounded'>
              <Accordion.Item eventKey='0'>
                <Accordion.Header>
                  Prikaži kontrole za računanje kuta
                </Accordion.Header>
                <Accordion.Body>
                  <Row>
                    <Col lg={3}>Koordinate prvog stupa u prvom redu:</Col>
                    <Col lg={2}>
                      <InputGroup>
                        <InputGroup.Text>x:</InputGroup.Text>
                        <input type="number" 
                          className='form-control text-end'
                          disabled={ angleCheckLocked }
                          value={ (angleCheckCoords.x1).toFixed(2) }
                          onChange={ (e) => handleCoordsChange('x1', e) }
                        />
                        <InputGroup.Text>m</InputGroup.Text>
                      </InputGroup>
                    </Col>
                    <Col lg={2}>
                      <InputGroup>
                        <InputGroup.Text>y:</InputGroup.Text>
                        <input type="number" 
                          className='form-control text-end'
                          disabled={angleCheckLocked}
                          value={ (angleCheckCoords.y1).toFixed(2) }
                          onChange={ (e) => handleCoordsChange('y1', e) }
                        />
                        <InputGroup.Text>m</InputGroup.Text>
                      </InputGroup>
                    </Col>
                  </Row>
                  <Row className='mt-2'>
                    <Col lg={3}>Koordinate zadnjeg stupa u prvom redu:</Col>
                    <Col lg={2}>
                      <InputGroup>
                        <InputGroup.Text>x:</InputGroup.Text>
                        <input type="number" 
                          className='form-control text-end'
                          disabled={ angleCheckLocked }
                          value={ (angleCheckCoords.x2).toFixed(2) }
                          onChange={ (e) => handleCoordsChange('x2', e) }
                        />
                        <InputGroup.Text>m</InputGroup.Text>
                      </InputGroup>
                    </Col>
                    <Col lg={2}>
                      <InputGroup>
                        <InputGroup.Text>y:</InputGroup.Text>
                        <input type="number" 
                          className='form-control text-end'
                          disabled={angleCheckLocked}
                          value={ (angleCheckCoords.y2).toFixed(2) }
                          onChange={ (e) => handleCoordsChange('y2', e) }
                        />
                        <InputGroup.Text>m</InputGroup.Text>
                      </InputGroup>
                    </Col>
                  </Row>
                  <Row className='mt-2'>
                    <Col lg={3}>
                      Kut rotacije:
                    </Col>
                    <Col lg={2}>
                      <InputGroup>
                        <input type="text" 
                          disabled
                          value={ (rotationAngle).toFixed(2) }
                          className='text-end form-control'
                        />
                        <InputGroup.Text>°</InputGroup.Text>
                      </InputGroup>
                    </Col>
                    <Col lg={1}></Col>
                    <Col lg={2}>
                      <label htmlFor="lockAngle">Zaključaj izračun kuta</label>
                    </Col>
                    <Col lg={1}>
                      <input type="checkbox" id="lockAngle" 
                        onChange={ (e) => handleLockAngle(e) }
                      />
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col lg={2}>Postavljanje slike voćnjaka</Col>
                    <Col lg={10}>
                      <input type="file" 
                        className='form-control'
                        onChange={ handleSelectFile }
                      />
                    </Col>
                  </Row>
                  <Row className='mt-3'>
                    <Col lg={4}></Col>
                    <Col lg={4} className='text-center'>
                      <Button variant='secondary'
                        onClick={ (e) => handleLogAngle() }>
                        Log koordinate stupova za kut</Button>
                    </Col>
                    <Col lg={4}></Col>
                  </Row>
                  <Row className="mt-3">
                    <Col>
                      <b>NAPOMENA: </b>
                      Dodatne kontrole i polja će biti prikazane nakon što se odabere slika voćnjaka i zaključa izračun kuta.
                    </Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            {/*  
              Skaliranje stupova
            */}
            {
              (angleCheckLocked && selectedFile) && (
                <Accordion className='shadow p-3 mb-2 bg-white rounded'>
                  <Accordion.Item eventKey='5'>
                    <Accordion.Header>
                      Postavke pozicije i skaliranja točaka na slici
                    </Accordion.Header>
                    <Accordion.Body>
                      <Row className="mt-3">
                        <Col lg={8}>
                          Potrebno je pozicionirati tri točke na sliku voćnjaka:
                          <ul>
                            <li>točku na poziciju stupa u prvom redu - <strong>točka A</strong></li>
                            <li>točku na poziciju stupa u prvom redu, stup koji je za <b>{ parseFloat(orchidParams.pillarSpace).toFixed(2) } metara </b> udaljen od stupa označenog točkom A - <strong>točka B</strong></li>
                            <li>točku na poziciju stupa u drugom redu - <strong>točka C</strong></li>
                          </ul>
                          Zadavanje ove tri točke je nužno za određivanje pomaka i skaliranja na slici voćnjaka u odnosu na
                          koordinate web dokumenta. 
                        </Col>
                        <Col lg={4}>
                          <img src="ABC.png" style={{ width: '22%' }}/>
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col lg={2}>Točka A (prvi red):</Col>
                        <Col lg={3}>
                          <InputGroup>
                            <Button variant='warning'
                              disabled={ !angleCheckLocked || disableSaO || isABchecked }
                              onClick={ (e) => handleChangeSaO('x1', 'dec') }>
                              -
                            </Button>
                            <InputGroup.Text>x1:</InputGroup.Text>
                            <input type="number" 
                              className='form-control text-end'
                              disabled={ !angleCheckLocked || disableSaO || isABchecked}
                              value={ parseFloat(scaleAndOffset.x1).toFixed(2) }
                              onChange={ (e) => handleChangeScaleAndOffset('x1', e) }
                            />
                            <Button variant='warning'
                              disabled={ !angleCheckLocked || disableSaO || isABchecked }
                              onClick={ (e) => handleChangeSaO('x1', 'inc') }>
                                +
                            </Button>
                          </InputGroup>
                        </Col>
                        <Col lg={3}>
                          <InputGroup>
                            <Button variant='warning'
                              disabled={ !angleCheckLocked || disableSaO || isABchecked }
                              onClick={ (e) => handleChangeSaO('y1', 'dec') }>
                              -
                            </Button>
                            <InputGroup.Text>y1:</InputGroup.Text>
                            <input type="number" 
                              className='form-control text-end'
                              disabled={ !angleCheckLocked || disableSaO || isABchecked }
                              value={ parseFloat(scaleAndOffset.y1).toFixed(2) }
                              onChange={ (e) => handleChangeScaleAndOffset('y1', e) }
                            />
                            <Button variant='warning'
                              disabled={ !angleCheckLocked || disableSaO || isABchecked }
                              onClick={ (e) => handleChangeSaO('y1', 'inc') }>
                                +
                              </Button>
                          </InputGroup>
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col lg={2}>Točka B (prvi red):</Col>
                        <Col lg={3}>
                          <InputGroup>
                            <Button variant='warning'
                              disabled
                              onClick={ (e) => handleChangeSaO('x2', 'dec') }>
                              -
                            </Button>
                            <InputGroup.Text>x2:</InputGroup.Text>
                            <input type="number" disabled
                              className='form-control text-end'
                              value={ parseFloat(scaleAndOffset.x1).toFixed(2) }
                              onChange={ (e) => handleChangeScaleAndOffset('x2', e) }
                            />
                            <Button variant='warning'
                              disabled
                              onClick={ (e) => handleChangeSaO('x2', 'inc') }>
                              +
                            </Button>
                          </InputGroup>
                        </Col>
                        <Col lg={3}>
                          <InputGroup>
                            <Button variant='warning'
                              disabled={ !angleCheckLocked || disableSaO || isABchecked }
                              onClick={ (e) => handleChangeSaO('y2', 'dec') }>
                              -
                            </Button>
                            <InputGroup.Text>y2:</InputGroup.Text>
                            <input type="number" 
                              className='form-control text-end'
                              disabled={ !angleCheckLocked || disableSaO || isABchecked }
                              value={ parseFloat(scaleAndOffset.y2).toFixed(2) }
                              onChange={ (e) => handleChangeScaleAndOffset('y2', e) }
                            />
                            <Button variant='warning'
                              disabled={ !angleCheckLocked || disableSaO || isABchecked }
                              onClick={ (e) => handleChangeSaO('y2', 'inc') }>
                              +
                            </Button>
                          </InputGroup>
                        </Col>
                      </Row>
                      <Row className='mt-3'>
                        <Container>
                          <Form>
                            <Form.Check
                              type='switch'
                              label='Potvrdi točke A i B'
                              checked={isABchecked}
                              onChange={handleChangeAB}
                            />
                          </Form>
                        </Container>
                      </Row>
                      <Row className="mt-3">
                        <Col lg={2}>Točka C (drugi red):</Col>
                        <Col lg={3}>
                          <InputGroup>
                            <Button variant='warning'
                              disabled={ !angleCheckLocked || disableSaO || isCchecked }
                              onClick={ (e) => handleChangeSaO('x3', 'dec') }>
                              -
                            </Button>
                            <InputGroup.Text>x3:</InputGroup.Text>
                            <input type="number" 
                              className='form-control text-end'
                              disabled={ !angleCheckLocked || disableSaO || isCchecked }
                              value={ parseFloat(scaleAndOffset.x3).toFixed(2) }
                              onChange={ (e) => handleChangeScaleAndOffset('x3', e) }
                            />
                            <Button variant='warning'
                              disabled={ !angleCheckLocked || disableSaO || isCchecked }
                              onClick={ (e) => handleChangeSaO('x3', 'inc') }>
                              +
                            </Button>
                          </InputGroup>
                        </Col>
                        <Col lg={3}>
                          <InputGroup>
                            <Button variant='warning'
                              disabled={ !angleCheckLocked || disableSaO || isCchecked }
                              onClick={ (e) => handleChangeSaO('y3', 'dec') }>
                              -
                            </Button>
                            <InputGroup.Text>y3:</InputGroup.Text>
                            <input type="number" 
                              className='form-control text-end'
                              disabled
                              value={ parseFloat(scaleAndOffset.y1).toFixed(2) }
                            />
                            <Button variant='warning'
                              disabled={ !angleCheckLocked || disableSaO || isCchecked }
                              onClick={ (e) => handleChangeSaO('y3', 'inc') }>
                              +
                            </Button>
                          </InputGroup>
                        </Col>
                      </Row>
                      <Row className='mt-3'>
                        <Container>
                          <Form>
                            <Form.Check
                              type='switch'
                              label='Potvrdi točku C'
                              checked={isCchecked}
                              onChange={handleChangeC}
                            />
                          </Form>
                        </Container>
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              )
            }
      

            {/* 
              Parametri voćnjaka
            */}

            {
              (angleCheckLocked && selectedFile) && (
                <Accordion className='shadow p-3 mb-2 bg-white rounded'>
                  <Accordion.Item eventKey='0'>
                    <Accordion.Header>
                      Prikaži kontrole za parametre voćnjaka
                    </Accordion.Header>
                    <Accordion.Body>
                      <Row>
                        <Col lg={3}>
                          <label htmlFor="rowWidth">Razmak između redova:</label>
                        </Col>
                        <Col lg={2}>
                          <InputGroup>
                            <input type="number" id="rowWidth" 
                              className='form-control text-end'
                              value={ (orchidParams.width).toFixed(2) }
                              onChange={ (e) => handleChangeOrchidParams('width', e) }
                            />
                            <InputGroup.Text>m</InputGroup.Text>
                          </InputGroup>
                        </Col>
                        <Col lg={7}>
                          <small className='text-muted'>
                            Prored - širina prolaza između dva reda
                          </small>
                        </Col>
                      </Row>
                      <Row className='mt-2'>
                        <Col lg={3}>
                          <label htmlFor="pillarSpace">Razmak između stupova:</label>
                        </Col>
                        <Col lg={2}>
                          <InputGroup>
                            <input type="number" id="pillarSpace" 
                              className='form-control text-end'
                              value={ (orchidParams.pillarSpace).toFixed(2) }
                              onChange={ (e) => handleChangeOrchidParams('pillarSpace', e) }
                            />
                            <InputGroup.Text>m</InputGroup.Text>
                          </InputGroup>
                        </Col>
                        <Col lg={7}>
                          <small className='text-muted'>
                            Normalni razmak između dva susjedna stupa u istom redu
                          </small>
                        </Col>
                      </Row>
                      <Row className='mt-2'>
                        <Col lg={3}>
                          <label htmlFor="rowStartOffset">Pomak od početka reda:</label>
                        </Col>
                        <Col lg={2}>
                          <InputGroup>
                            <input type="number" id="rowStartOffset" 
                              className='form-control text-end'
                              value={ (orchidParams.rowStartOffset).toFixed(2) }
                              onChange={ (e) => handleChangeOrchidParams('rowStartOffset', e) }
                            />
                            <InputGroup.Text>m</InputGroup.Text>
                          </InputGroup>
                        </Col>
                        <Col lg={7}>
                          <small className='text-muted'>
                            Udaljenost prve točke snimanja u redu od početka reda
                          </small>
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        <Col lg={3}>
                          <label htmlFor="robotStep">Razmak između dvije točke snimanja:</label>
                        </Col>
                        <Col lg={2}>
                          <InputGroup>
                            <input type="number" id="robotStep" 
                              className='form-control text-end'
                              value={ (orchidParams.robotStep).toFixed(2) }
                              onChange={ (e) => handleChangeOrchidParams('robotStep', e) }
                            />
                            <InputGroup.Text>m</InputGroup.Text>
                          </InputGroup>
                        </Col>
                        <Col lg={7}>
                          <small className='text-muted'>
                            Udaljenost između dvije susjedne točke u kojima robot snima
                          </small>
                        </Col>
                      </Row>
                      <Row className='mt-3'>
                        <Col lg={4}></Col>
                        <Col lg={4} className='text-center'>
                          <Button variant='secondary'
                            onClick={ (e) => handleLogGeneralOrchidParams() }>
                            Log općih parametara voćnjaka</Button>
                        </Col>
                        <Col lg={4}></Col>
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              )
            }

            {/*  
              Vanjski poligon kretanja robota
            */}

            {
              (angleCheckLocked && selectedFile) && (
                <Accordion className='shadow p-3 mb-2 bg-white rounded'>
                  <Accordion.Item eventKey='3'>
                    <Accordion.Header>
                    Zadavanje točaka vanjskog ruba kretanja robota - vanjski poligon
                    </Accordion.Header>
                    <Accordion.Body>
                      <h5 className='text-danger'>
                        Prilikom zadavanja točaka vanjskog poligona unutar kojeg se robot može (smije) kretati
                        treba voditi pozornost o tome da su prva zadana točka i zadnja zadana točka izravno povezane i 
                        taj brid zatvara površinu poligona.
                      </h5>
                      <Row className="mt-3">
                        <Col lg={12}>
                          <div className="d-grid gap-2">
                            <Button
                              variant='success'
                              size='lg'
                              onClick={ () => handleAddNewVertex() }
                            >
                              Dodaj novi vrh poligona
                            </Button>
                          </div>
                        </Col>
                      </Row>
                      {
                        (edgePolygon.length > 0) ? (
                          edgePolygon.map((vertex, i) => {
                            return (
                              <Row className="mt-3" key={ 'edgeRow' + i }>
                                <Col lg={2}>
                                  Vrh { i + 1 }
                                </Col>
                                <Col lg={2}>
                                  <InputGroup>
                                    <InputGroup.Text>x</InputGroup.Text>
                                    <input type="number"
                                      className='text-end form-control'
                                      value={ (vertex.x).toFixed(2) }
                                      onChange={ (e) => hendleChangeEdgePolygonVertex('x', i, e) }
                                    />
                                    <InputGroup.Text>m</InputGroup.Text>
                                  </InputGroup>
                                </Col>
                                <Col lg={2}>
                                  <InputGroup>
                                    <InputGroup.Text>y</InputGroup.Text>
                                    <input type="number"
                                      className='text-end form-control'
                                      value={ (vertex.y).toFixed(2) }
                                      onChange={ (e) => hendleChangeEdgePolygonVertex('y', i, e) }
                                    />
                                    <InputGroup.Text>m</InputGroup.Text>
                                  </InputGroup>
                                </Col>
                                <Col lg={4}></Col>
                                <Col lg={2}>
                                  <Button
                                    variant='danger'
                                    onClick={ () => handleDeleteVertex(i) }
                                  >
                                    Obriši točku (vrh)
                                  </Button>
                                </Col>
                              </Row>
                            )
                          })
                        ) : (
                          <Row className="mt-2 mb-2">
                            <Col lg={12}>
                              Nema zadanih točaka vanjskog poligona
                            </Col>
                          </Row>
                        )
                      }
                      {
                        (edgePolygon.length > 0) && (
                          <Row className="mt-3">
                            <Col lg={12}>
                              <div className="d-grid gap-2">
                                <Button
                                  variant='success'
                                  size='lg'
                                  onClick={ () => handleAddNewVertex() }
                                >
                                  Dodaj novi vrh poligona
                                </Button>
                              </div>
                            </Col>
                          </Row>
                        )
                      }
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              )
            }

            {/* 
              Unutarnji poligon - stupovi nepravilnog voćnjaka
            */}

            {
              (angleCheckLocked && selectedFile) && (
                <Accordion className='shadow p-3 mb-2 bg-white rounded'>
                  <Accordion.Item eventKey='3'>
                    <Accordion.Header>
                      Zadavanje točaka poligona površine sa stupovima
                    </Accordion.Header>
                    <Accordion.Body>
                      <h5 className='text-danger'>
                        Potrebno je zadati koordinate stupova koji su vrhovi poligona (4 točke) kako bi se mogao obaviti izračun.
                      </h5>
                      <Row className='mt-3'>
                        <Col lg={12}>
                          <div className="d-grid gap-2">
                            <Button
                              variant='success'
                              size='lg'
                              onClick={ handleAddNewPolygon }
                            >
                              Dodaj novi poligon
                            </Button>
                          </div>
                        </Col>
                      </Row>
                      {
                        (polygons.length > 0) ? (
                          polygons.map((poly, i) => {
                            return (
                              <>
                                <Row className="mt-2" key={ 'row' + i }>
                                  <Col lg={1}>Poligon { i + 1 }:</Col>
                                  <Col lg={2} className='bg-secondary p-1 m-1'>
                                    <div className='text-center text-white fw-bold'>
                                      Vrh 1
                                    </div>
                                    <div>
                                      <InputGroup>
                                        <InputGroup.Text>x1:</InputGroup.Text>
                                        <input type="number"
                                          key={ 'x1' + i }
                                          value={ (poly.x1).toFixed(2) }
                                          className='form-control text-end'
                                          onChange={ (e) => handleChangePolygon('x1', i, e) }
                                        />
                                        <InputGroup.Text>m</InputGroup.Text>
                                      </InputGroup>
                                    </div>
                                    <div className='mt-1'>
                                      <InputGroup>
                                        <InputGroup.Text>y1:</InputGroup.Text>
                                        <input type="number"
                                          key={ 'y1' + i }
                                          value={ (poly.y1).toFixed(2) }
                                          className='form-control text-end'
                                          onChange={ (e) => handleChangePolygon('y1', i, e) }
                                        />
                                        <InputGroup.Text>m</InputGroup.Text>
                                      </InputGroup>
                                    </div>
                                  </Col>
                                  <Col lg={2} className='bg-secondary p-1 m-1'>
                                    <div className='text-center text-white fw-bold'>
                                      Vrh 2
                                    </div>
                                    <div>
                                      <InputGroup>
                                        <InputGroup.Text>x2:</InputGroup.Text>
                                        <input type="number" disabled
                                          key={ 'x2' + i }
                                          value={ (poly.x1).toFixed(2) }
                                          className='form-control text-end'
                                          onChange={ (e) => handleChangePolygon('x2', i, e) }
                                        />
                                        <InputGroup.Text>m</InputGroup.Text>
                                      </InputGroup>
                                    </div>
                                    <div className='mt-1'>
                                      <InputGroup>
                                        <InputGroup.Text>y2:</InputGroup.Text>
                                        <input type="number"
                                          key={ 'y2' + i }
                                          value={ (poly.y2).toFixed(2) }
                                          className='form-control text-end'
                                          onChange={ (e) => handleChangePolygon('y2', i, e) }
                                        />
                                        <InputGroup.Text>m</InputGroup.Text>
                                      </InputGroup>
                                    </div>
                                  </Col>
                                  <Col lg={2} className='bg-secondary p-1 m-1'>
                                    <div className='text-center text-white fw-bold'>
                                      Vrh 3
                                    </div>
                                    <div>
                                      <InputGroup>
                                        <InputGroup.Text>x3:</InputGroup.Text>
                                        <input type="number"
                                          key={ 'x3' + i }
                                          value={ (poly.x3).toFixed(2) }
                                          className='form-control text-end'
                                          onChange={ (e) => handleChangePolygon('x3', i, e) }
                                        />
                                        <InputGroup.Text>m</InputGroup.Text>
                                      </InputGroup>
                                    </div>
                                    <div className='mt-1'>
                                      <InputGroup>
                                        <InputGroup.Text>y3:</InputGroup.Text>
                                        <input type="number"
                                          key={ 'y3' + i }
                                          value={ (poly.y3).toFixed(2) }
                                          className='form-control text-end'
                                          onChange={ (e) => handleChangePolygon('y3', i, e) }
                                        />
                                        <InputGroup.Text>m</InputGroup.Text>
                                      </InputGroup>
                                    </div>
                                  </Col>
                                  <Col lg={2} className='bg-secondary p-1 m-1'>
                                    <div className='text-center text-white fw-bold'>
                                      Vrh 4
                                    </div>
                                    <div>
                                      <InputGroup>
                                        <InputGroup.Text>x4:</InputGroup.Text>
                                        <input type="number" disabled
                                          key={ 'x4' + i }
                                          value={ (poly.x3).toFixed(2) }
                                          className='form-control text-end'
                                          onChange={ (e) => handleChangePolygon('x4', i, e) }
                                        />
                                        <InputGroup.Text>m</InputGroup.Text>
                                      </InputGroup>
                                    </div>
                                    <div className='mt-1'>
                                      <InputGroup>
                                        <InputGroup.Text>y4:</InputGroup.Text>
                                        <input type="number"
                                          key={ 'y4' + i }
                                          value={ (poly.y4).toFixed(2) }
                                          className='form-control text-end'
                                          onChange={ (e) => handleChangePolygon('y4', i, e) }
                                        />
                                        <InputGroup.Text>m</InputGroup.Text>
                                      </InputGroup>
                                    </div>
                                  </Col>
                                  <Col lg={2}>
                                    <Button
                                      variant='danger'
                                      onClick={ () => handleDeletePolygon(i) }
                                    >
                                      Obriši poligon
                                    </Button>
                                  </Col>
                                </Row>
                                {
                                  (i < (polygons.length - 1)) ? (
                                    <hr/>
                                  ) : (
                                    <></>
                                  )
                                }
                              </>
                            );
                          })
                        ) : (
                          <Row className='mt-2 mb-2'>
                            <Col lg={12}>
                              Nema zadanih poligona
                            </Col>
                          </Row>
                        )
                      }
                      {
                        (polygons.length > 0) && (
                          <Row className='mt-3'>
                            <Col lg={12}>
                              <div className="d-grid gap-2">
                                <Button
                                  variant='success'
                                  size='lg'
                                  onClick={ handleAddNewPolygon }
                                >
                                  Dodaj novi poligon
                                </Button>
                              </div>
                            </Col>
                          </Row>
                        )
                      }
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              )
            }

            {/*
              Slika
            */}

            {
              (angleCheckLocked && selectedFile) && (
                <Row className='mt-2'>
                  <Col lg={1}></Col>
                  <Col lg={10} className='shadow p-3 mb-5 bg-white rounded'>
                    {
                      (selectedFile && xmlLoaded) && (
                        <svg 
                          viewBox={"0 0 " + (1.1 * svgWidth) + " " + (1.1 * svgHeight)}
                          style={ {
                            backgroundClip: 'padding-box',
                            zIndex: -1,
                            backgroundImage: `url(${preview})`, 
                            backgroundRepeat: 'no-repeat', 
                            backgroundSize: 'cover',
                            
                            transform: (angleCheckLocked === true) ? `rotate(${rotationAngle}deg)` :  `rotate(0deg)`
                          } } 
                        >
                        
                          {
                            (angleCheckLocked) && (
                              <>
                                {
                                  (!disableSaO) && (
                                    <>
                                      <g>
                                        <circle cx={scaleAndOffset.x1 } cy={(1.1 * svgHeight) - scaleAndOffset.y1 } r={5} stroke={'blue'} strokeWidth={2} fill='none' />
                                        <text className='fs-3 fw-bold' x={ scaleAndOffset.x1 } y={(1.1 * svgHeight) - scaleAndOffset.y1 - 10}>Točka A</text>
                                      </g>
                                      <g>
                                        <circle cx={scaleAndOffset.x1 } cy={(1.1 * svgHeight) - scaleAndOffset.y2 } r={5} stroke={'red'} strokeWidth={2} fill='none'/>
                                        <text className='fs-3 fw-bold' x={ scaleAndOffset.x1 } y={(1.1 * svgHeight) - scaleAndOffset.y2 - 10}>Točka B</text>
                                      </g>
                                      <g>
                                        <circle cx={scaleAndOffset.x3 } cy={(1.1 * svgHeight) - scaleAndOffset.y1 } r={5} stroke={'black'} strokeWidth={2} fill='none'/>
                                        <text className='fs-3 fw-bold' x={ scaleAndOffset.x3 } y={(1.1 * svgHeight) - scaleAndOffset.y1 - 10}>Točka C</text>
                                      </g>
                                    </>
                                  )
                                }
                              </>
                            )
                          }
                          {
                            // mapiranje stupova
                            // mapiranje točaka
                          }
                        </svg>
                      )
                    }
                  </Col>
                  <Col lg={1}></Col>
                </Row>
              )
            }

            {/*
              Dugme za izračunavanje svih točaka
            */}

            {
              (angleCheckLocked && selectedFile && xmlLoaded && isABchecked && isCchecked && edgePolygon.length > 3 && polygons.length > 0) && (
                <Row className="mt-3 mb-3">
                  <Col lg={4}></Col>
                  <Col lg={4} className='text-center'>
                    <Button variant='success'
                      onClick={ (e) => handleCalculate() }
                    >Izračunaj točke</Button>
                  </Col>
                  <Col lg={4}></Col>
                </Row>
              )
            }

          </Col>
        </Row>
    </div>
  );
}

export default App;
