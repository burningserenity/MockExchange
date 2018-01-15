export default {

  // Event handler 

  handleChange(e) {
    let prop = e.target.id;
    let change = {};

    change[prop] = e.target.value;
    this.setState(change);
  }
}
