<form method="post" action="<? echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
    <div class="form-group">
        <label for="courseId">Course ID</label>
        <input type="text" class="form-control" id="courseId" name="courseId" maxlength="12">
    </div>
    <div class="form-group">
       <label for="courseName">Course Name</label>
        <input type="text" class="form-control" id="courseName" name="courseName" maxlength="255">
    </div>
    <button type="submit" class="btn btn-primary">Add Course</button>
</form>