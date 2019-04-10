This is a draft for how PeoplePicker's API might look under the new design

There are still some kinks I'd like to iron out, particularly around the API shape for Suggestions header & footer items. It can't really be done without also forcing Suggestions into an inversion-of-control design.

I'd like to provide 'searching' and 'no result' handlers by default but the composiiton doesn't work out very well to be honest.
