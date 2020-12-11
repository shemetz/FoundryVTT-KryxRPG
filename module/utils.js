if (String.prototype.replaceAll === undefined) {
  // https://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string
  String.prototype.replaceAll = function (find, replace) {
    const str = this;
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
  }
}