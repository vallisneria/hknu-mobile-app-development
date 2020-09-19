module.exports.about = function (req, res) {
    res.render('generic-text', {
        title: 'About',
        content: 'Loc8r was created to help people find places to sit down and get a bit of work donw.<br/><br/>'
            + 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
            + 'Pellentesque ornare luctus enim, sit amet tristique lectus maximus a. Aliquam erat volutpat.'
    });
}
